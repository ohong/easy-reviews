// Pure validator for the B↔C question-set contract (spec.md "The B↔C contract").
// This is the one fully-specified seam in the spec, and the most bug-prone integration
// boundary (AI core emits, interview UI consumes). It has zero app dependencies, so it
// is enforceable today and serves as the runtime guard the generation service should
// also call before returning a set to the client.

export type QuestionType = "rating" | "single" | "multi" | "text";

export interface Option {
  id: string;
  label: string;
}

export interface Question {
  id: string;
  prompt: string;
  type: QuestionType;
  options?: Option[];
  optional?: boolean;
}

export interface QuestionSet {
  businessName: string;
  category: string;
  questions: Question[];
}

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

/**
 * Validate a question set against the contract + interview-engine rules (FR-2.3).
 * Fails noisily with a list of every violation (Rule of Robustness) rather than
 * throwing on the first.
 */
export function validateQuestionSet(set: unknown): ValidationResult {
  const errors: string[] = [];
  const push = (m: string) => errors.push(m);

  if (typeof set !== "object" || set === null) {
    return { ok: false, errors: ["set is not an object"] };
  }
  const s = set as Partial<QuestionSet>;

  if (typeof s.businessName !== "string" || s.businessName.length === 0) {
    push("businessName must be a non-empty string");
  }
  if (typeof s.category !== "string" || s.category.length === 0) {
    push("category must be a non-empty string");
  }

  const qs = s.questions;
  if (!Array.isArray(qs)) {
    return { ok: false, errors: [...errors, "questions must be an array"] };
  }

  // FR-2.3: 4–5 questions.
  if (qs.length < 4 || qs.length > 5) {
    push(`expected 4–5 questions, got ${qs.length}`);
  }

  // Contract: questions[0].type is always "rating".
  if (qs.length === 0 || qs[0]?.type !== "rating") {
    push('questions[0].type must be "rating"');
  }

  const ids = new Set<string>();
  let multiCount = 0;
  let textCount = 0;

  qs.forEach((q, i) => {
    const at = `questions[${i}]`;
    if (!q || typeof q !== "object") {
      push(`${at} is not an object`);
      return;
    }
    if (typeof q.id !== "string" || q.id.length === 0) push(`${at}.id must be a non-empty string`);
    else if (ids.has(q.id)) push(`${at}.id "${q.id}" is duplicated`);
    else ids.add(q.id);

    if (typeof q.prompt !== "string" || q.prompt.length === 0) push(`${at}.prompt must be a non-empty string`);

    const validTypes: QuestionType[] = ["rating", "single", "multi", "text"];
    if (!validTypes.includes(q.type)) {
      push(`${at}.type "${q.type}" is invalid`);
    }

    // rating after Q1 is not part of the contract — only Q1 is the rating.
    if (i > 0 && q.type === "rating") push(`${at}.type "rating" only allowed at index 0`);

    if (q.type === "multi") multiCount++;
    if (q.type === "text") textCount++;

    // choice questions need options; rating/text must not carry them.
    if (q.type === "single" || q.type === "multi") {
      if (!Array.isArray(q.options) || q.options.length === 0) {
        push(`${at}.options must be a non-empty array for type "${q.type}"`);
      } else {
        q.options.forEach((o, j) => {
          if (typeof o?.id !== "string" || o.id.length === 0) push(`${at}.options[${j}].id must be a non-empty string`);
          if (typeof o?.label !== "string" || o.label.length === 0) push(`${at}.options[${j}].label must be a non-empty string`);
        });
      }
    }

    // text question must be optional (FR-2.5: free-text is skippable / <60s budget).
    if (q.type === "text" && q.optional !== true) {
      push(`${at} of type "text" must be optional:true`);
    }
  });

  // Contract shape: at most one multi, at most one text.
  if (multiCount > 1) push(`expected at most one "multi" question, got ${multiCount}`);
  if (textCount > 1) push(`expected at most one "text" question, got ${textCount}`);

  return { ok: errors.length === 0, errors };
}

/** Branch key derived from the Q1 rating (FR-2.4). */
export type Branch = "good" | "mixed" | "rough";

export function branchForRating(rating: number): Branch {
  if (rating >= 4) return "good";
  if (rating === 3) return "mixed";
  return "rough"; // 1–2
}
