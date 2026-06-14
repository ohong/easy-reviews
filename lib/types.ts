/**
 * Shared contracts. Pure types + tiny pure helpers — safe to import from both
 * server and client code (no secrets, no node APIs).
 *
 * The B↔C contract (the generated question set) lives here so the AI core (WS-B)
 * emits it and the interview UI (WS-C) renders it against the same shape.
 */

export type QuestionType = "rating" | "single" | "multi" | "text";

export interface QuestionOption {
  id: string;
  label: string;
}

export interface Question {
  id: string;
  prompt: string;
  type: QuestionType;
  /** Present for `single` and `multi`. */
  options?: QuestionOption[];
  /** `text` questions may be skippable. */
  optional?: boolean;
  /** Short helper line under the prompt. */
  helpText?: string;
}

/** Generated once per business and cached. `questions[0].type` is always "rating". */
export interface QuestionSet {
  businessName: string;
  category: string;
  questions: Question[];
}

export type AnswerValue = number | string | string[];

/**
 * One captured answer. We persist the prompt + resolved labels alongside the raw
 * value so review generation is grounded in self-contained, human-readable facts
 * and history rows render without re-joining the question set.
 */
export interface InterviewAnswer {
  questionId: string;
  prompt: string;
  type: QuestionType;
  value: AnswerValue;
  /** Resolved option labels for single/multi selections. */
  labels?: string[];
}

export type InterviewAnswers = InterviewAnswer[];

/** A business resolved from Places, used by the confirmation card + interview. */
export interface ResolvedBusiness {
  placeId: string;
  name: string;
  address: string | null;
  category: string | null;
  /** Machine type, e.g. "coffee_shop". */
  primaryType: string | null;
  lat: number | null;
  lng: number | null;
  rating: number | null;
}

/** The Google "write a review" deep link for a place id. */
export function writeReviewUrl(placeId: string): string {
  return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(
    placeId,
  )}`;
}

/** Rating buckets that drive interview branching + tone. */
export type RatingBranch = "positive" | "mixed" | "negative";

export function ratingBranch(rating: number): RatingBranch {
  if (rating >= 4) return "positive";
  if (rating <= 2) return "negative";
  return "mixed";
}
