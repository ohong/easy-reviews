import "server-only";
import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { businesses, reviews } from "@/lib/db/schema";
import type { InterviewAnswers } from "@/lib/types";

export interface Owner {
  userId?: string | null;
  sessionId?: string | null;
}

export interface SaveReviewInput {
  placeId: string;
  rating: number;
  answers: InterviewAnswers;
  generatedText: string;
  sessionId?: string | null;
  userId?: string | null;
}

export async function saveReview(input: SaveReviewInput) {
  const [row] = await db
    .insert(reviews)
    .values({
      placeId: input.placeId,
      rating: input.rating,
      answers: input.answers,
      generatedText: input.generatedText,
      finalText: input.generatedText,
      sessionId: input.sessionId ?? null,
      userId: input.userId ?? null,
    })
    .returning();
  return row;
}

export async function getReview(id: string) {
  const [row] = await db
    .select()
    .from(reviews)
    .where(eq(reviews.id, id))
    .limit(1);
  return row ?? null;
}

/**
 * Ownership check — runs inside every mutation (Server Actions are public POST
 * endpoints). Owned reviews are gated by user id; anonymous ones by session id.
 */
function assertOwner(row: typeof reviews.$inferSelect, owner: Owner): void {
  if (row.userId) {
    if (!owner.userId || owner.userId !== row.userId)
      throw new Error("Forbidden");
  } else if (!owner.sessionId || owner.sessionId !== row.sessionId) {
    throw new Error("Forbidden");
  }
}

export async function updateReviewText(
  id: string,
  finalText: string,
  owner: Owner,
) {
  const row = await getReview(id);
  if (!row) throw new Error("Not found");
  assertOwner(row, owner);
  await db
    .update(reviews)
    .set({ finalText, updatedAt: new Date() })
    .where(eq(reviews.id, id));
}

/** Regeneration replaces both the generated text and the (un-edited) final text. */
export async function replaceReviewText(id: string, text: string, owner: Owner) {
  const row = await getReview(id);
  if (!row) throw new Error("Not found");
  assertOwner(row, owner);
  await db
    .update(reviews)
    .set({ generatedText: text, finalText: text, updatedAt: new Date() })
    .where(eq(reviews.id, id));
}

export async function markPosted(id: string, owner: Owner) {
  const row = await getReview(id);
  if (!row) throw new Error("Not found");
  assertOwner(row, owner);
  await db
    .update(reviews)
    .set({ posted: true, updatedAt: new Date() })
    .where(eq(reviews.id, id));
}

export async function deleteReview(id: string, owner: Owner) {
  const row = await getReview(id);
  if (!row) throw new Error("Not found");
  assertOwner(row, owner);
  await db.delete(reviews).where(eq(reviews.id, id));
}

export interface HistoryItem {
  id: string;
  placeId: string;
  businessName: string;
  rating: number;
  finalText: string;
  posted: boolean;
  createdAt: Date;
}

export async function getHistoryForUser(userId: string): Promise<HistoryItem[]> {
  const rows = await db
    .select({
      id: reviews.id,
      placeId: reviews.placeId,
      rating: reviews.rating,
      finalText: reviews.finalText,
      posted: reviews.posted,
      createdAt: reviews.createdAt,
      businessName: businesses.name,
    })
    .from(reviews)
    .innerJoin(businesses, eq(reviews.placeId, businesses.placeId))
    .where(eq(reviews.userId, userId))
    .orderBy(desc(reviews.createdAt));
  return rows.map((r) => ({ ...r, businessName: r.businessName ?? "Unknown" }));
}

/** Fast-follow: attach a signed-out session's reviews to a user on sign-up. */
export async function claimAnonymousReviews(sessionId: string, userId: string) {
  if (!sessionId) return;
  await db
    .update(reviews)
    .set({ userId, updatedAt: new Date() })
    .where(and(eq(reviews.sessionId, sessionId), isNull(reviews.userId)));
}
