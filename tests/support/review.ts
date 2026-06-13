// Pure, reusable assertions for review output + handoff. The build should import
// these so the same rules guard production and tests (single source of truth).

import { WRITE_REVIEW_BASE } from "./fixtures";

/** Word count used for the 40–80 word bound (FR-3.1, AC-GEN-1). */
export function wordCount(text: string): number {
  const t = text.trim();
  return t.length === 0 ? 0 : t.split(/\s+/).length;
}

export function isWithinLengthBounds(text: string, min = 40, max = 80): boolean {
  const n = wordCount(text);
  return n >= min && n <= max;
}

/** The only viable Google handoff link (FR-4.3) — cannot pre-fill text/stars. */
export function buildWriteReviewUrl(placeId: string): string {
  if (!placeId) throw new Error("buildWriteReviewUrl: placeId is required");
  return `${WRITE_REVIEW_BASE}${encodeURIComponent(placeId)}`;
}

/**
 * Deterministic grounding guard (AC-GEN-2): given the review and the list of facts
 * the user is NOT allowed to have invented, return any that leaked in. Empty == pass.
 * This is the cheap PR-CI check; the LLM-judge entity-traceability runs nightly.
 */
export function findForbiddenInventions(review: string, forbidden: string[]): string[] {
  const hay = review.toLowerCase();
  return forbidden.filter((f) => hay.includes(f.toLowerCase()));
}

/** Natural-voice denylist check (AC-GEN-6). Empty == pass. */
export function findAiTells(review: string, denylist: string[]): string[] {
  const hay = review.toLowerCase();
  return denylist.filter((p) => hay.includes(p.toLowerCase()));
}
