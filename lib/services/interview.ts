import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { businesses } from "@/lib/db/schema";
import { getPlaceDetails } from "@/lib/places";
import { generateQuestionSet, generateReviewSummary } from "@/lib/ai/generate";
import type { QuestionSet, ResolvedBusiness } from "@/lib/types";

// Regenerate a business's question set at most once every ~60 days (FR-2.6).
const QUESTION_TTL_MS = 60 * 24 * 60 * 60 * 1000;

export interface PreparedInterview {
  business: ResolvedBusiness;
  questionSet: QuestionSet;
}

function rowToBusiness(row: typeof businesses.$inferSelect): ResolvedBusiness {
  return {
    placeId: row.placeId,
    name: row.name,
    address: row.address,
    category: row.category,
    primaryType: row.primaryType,
    lat: row.lat,
    lng: row.lng,
    rating: row.rating,
  };
}

/**
 * Return a business's interview, generating + caching it on first use. Pulls
 * category + up to 5 reviews from Places, summarizes them to nudge relevance,
 * then generates the tailored question set — all cached on the businesses row.
 */
export async function prepareInterview(
  placeId: string,
): Promise<PreparedInterview> {
  const [existing] = await db
    .select()
    .from(businesses)
    .where(eq(businesses.placeId, placeId))
    .limit(1);

  const fresh =
    existing?.questionSet &&
    existing.questionsGeneratedAt &&
    Date.now() - existing.questionsGeneratedAt.getTime() < QUESTION_TTL_MS;

  if (existing && fresh && existing.questionSet) {
    return { business: rowToBusiness(existing), questionSet: existing.questionSet };
  }

  const details = await getPlaceDetails(placeId);
  const nudge = await generateReviewSummary(details, details.reviews);
  const questionSet = await generateQuestionSet(details, nudge);
  const now = new Date();

  await db
    .insert(businesses)
    .values({
      placeId: details.placeId,
      name: details.name,
      address: details.address,
      category: details.category,
      primaryType: details.primaryType,
      lat: details.lat,
      lng: details.lng,
      rating: details.rating,
      reviewSummary: nudge.summary || null,
      questionSet,
      questionsGeneratedAt: now,
    })
    .onConflictDoUpdate({
      target: businesses.placeId,
      set: {
        name: details.name,
        address: details.address,
        category: details.category,
        primaryType: details.primaryType,
        lat: details.lat,
        lng: details.lng,
        rating: details.rating,
        reviewSummary: nudge.summary || null,
        questionSet,
        questionsGeneratedAt: now,
        updatedAt: now,
      },
    });

  return { business: details, questionSet };
}

/** Minimal business identity used by review generation. */
export async function getStoredBusiness(
  placeId: string,
): Promise<{ name: string; category: string } | null> {
  const [row] = await db
    .select({ name: businesses.name, category: businesses.category })
    .from(businesses)
    .where(eq(businesses.placeId, placeId))
    .limit(1);
  if (!row) return null;
  return { name: row.name, category: row.category ?? "business" };
}
