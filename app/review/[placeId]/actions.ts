"use server";

import { prepareInterview, getStoredBusiness } from "@/lib/services/interview";
import { getPlaceSummary } from "@/lib/places";
import { generateReview } from "@/lib/ai/generate";
import {
  saveReview,
  getReview,
  replaceReviewText,
  updateReviewText,
  markPosted,
} from "@/lib/services/reviews";
import { getOptionalUserId } from "@/lib/auth-session";
import { generateReviewInputSchema } from "@/lib/validations";
import type { QuestionSet } from "@/lib/types";

type Result<T> = ({ ok: true } & T) | { ok: false; error: string };
type SimpleResult = { ok: true } | { ok: false; error: string };

function friendly(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes("ANTHROPIC_API_KEY"))
    return "Review generation isn't configured yet — the server is missing its Anthropic API key.";
  if (msg.includes("GOOGLE_API_KEY"))
    return "Business lookup isn't configured yet — the server is missing its Google API key.";
  if (msg === "Forbidden") return "You can't edit this review.";
  if (msg === "Not found") return "We couldn't find that review.";
  return "Something went wrong. Please try again.";
}

async function businessFor(placeId: string) {
  const stored = await getStoredBusiness(placeId);
  if (stored) return stored;
  const summary = await getPlaceSummary(placeId);
  return { name: summary.name, category: summary.category ?? "business" };
}

/** Fetch (or generate + cache) the interview for a business. */
export async function prepareInterviewAction(
  placeId: string,
): Promise<Result<{ questionSet: QuestionSet }>> {
  try {
    const { questionSet } = await prepareInterview(placeId);
    return { ok: true, questionSet };
  } catch (err) {
    return { ok: false, error: friendly(err) };
  }
}

/** Generate the first review from the interview answers and persist it. */
export async function generateReviewAction(
  raw: unknown,
): Promise<Result<{ reviewId: string; text: string; rating: number }>> {
  const parsed = generateReviewInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid submission." };
  const { placeId, rating, answers, sessionId } = parsed.data;
  try {
    const business = await businessFor(placeId);
    const text = await generateReview({ business, rating, answers });
    const userId = await getOptionalUserId();
    const row = await saveReview({
      placeId,
      rating,
      answers,
      generatedText: text,
      sessionId: sessionId ?? null,
      userId,
    });
    return { ok: true, reviewId: row.id, text, rating };
  } catch (err) {
    return { ok: false, error: friendly(err) };
  }
}

/** Produce a fresh take under the same constraints, replacing the stored text. */
export async function regenerateReviewAction(input: {
  reviewId: string;
  sessionId?: string;
  avoid?: string;
}): Promise<Result<{ text: string }>> {
  try {
    const review = await getReview(input.reviewId);
    if (!review) return { ok: false, error: "We couldn't find that review." };
    const business = await businessFor(review.placeId);
    const text = await generateReview({
      business,
      rating: review.rating,
      answers: review.answers,
      avoid: input.avoid ?? review.finalText,
    });
    const userId = await getOptionalUserId();
    await replaceReviewText(input.reviewId, text, {
      userId,
      sessionId: input.sessionId,
    });
    return { ok: true, text };
  } catch (err) {
    return { ok: false, error: friendly(err) };
  }
}

/** Persist inline edits to the review text. */
export async function saveFinalTextAction(input: {
  reviewId: string;
  finalText: string;
  sessionId?: string;
}): Promise<SimpleResult> {
  try {
    const userId = await getOptionalUserId();
    await updateReviewText(input.reviewId, input.finalText.slice(0, 2000), {
      userId,
      sessionId: input.sessionId,
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: friendly(err) };
  }
}

/** Best-effort funnel flag when the user taps "Copy & open Google". */
export async function markPostedAction(input: {
  reviewId: string;
  sessionId?: string;
}): Promise<SimpleResult> {
  try {
    const userId = await getOptionalUserId();
    await markPosted(input.reviewId, { userId, sessionId: input.sessionId });
    return { ok: true };
  } catch {
    // Funnel analytics only — never block the handoff on this.
    return { ok: false, error: "" };
  }
}
