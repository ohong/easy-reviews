// AC-INT-1 / AC-INT-2 — the B↔C question-set contract, enforced NOW.
// These run today (pure, no app). The generation service should also call
// validateQuestionSet() before returning, so a malformed set fails server-side
// (fail noisily) instead of breaking the interview UI.
import { describe, expect, test } from "bun:test";
import { branchForRating, validateQuestionSet, type QuestionSet } from "./support/question-set";
import { ratingBranches, validQuestionSet } from "./support/fixtures";

describe("AC-INT-1 — question set shape", () => {
  test("the canonical fixture is valid", () => {
    const r = validateQuestionSet(validQuestionSet);
    expect(r.errors).toEqual([]);
    expect(r.ok).toBe(true);
  });

  test("Q1 must be a rating", () => {
    const bad: QuestionSet = {
      ...validQuestionSet,
      questions: [
        { id: "q1", prompt: "What did you order?", type: "single", options: [{ id: "a", label: "A" }] },
        ...validQuestionSet.questions.slice(1),
      ],
    };
    const r = validateQuestionSet(bad);
    expect(r.ok).toBe(false);
    expect(r.errors).toContain('questions[0].type must be "rating"');
  });

  test("must have 4–5 questions", () => {
    const tooFew = { ...validQuestionSet, questions: validQuestionSet.questions.slice(0, 2) };
    expect(validateQuestionSet(tooFew).ok).toBe(false);

    const tooMany = {
      ...validQuestionSet,
      questions: [
        ...validQuestionSet.questions,
        { id: "q5", prompt: "x", type: "single" as const, options: [{ id: "a", label: "A" }] },
        { id: "q6", prompt: "y", type: "single" as const, options: [{ id: "b", label: "B" }] },
      ],
    };
    expect(validateQuestionSet(tooMany).ok).toBe(false);
  });

  test("single/multi questions require non-empty options", () => {
    const bad = {
      ...validQuestionSet,
      questions: [
        validQuestionSet.questions[0],
        { id: "q2", prompt: "Pick one", type: "single" as const, options: [] },
        validQuestionSet.questions[2],
        validQuestionSet.questions[3],
      ],
    };
    const r = validateQuestionSet(bad);
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.includes("options must be a non-empty array"))).toBe(true);
  });

  test("text question must be optional", () => {
    const bad = {
      ...validQuestionSet,
      questions: [
        ...validQuestionSet.questions.slice(0, 3),
        { id: "q4", prompt: "Anything else?", type: "text" as const, optional: false },
      ],
    };
    const r = validateQuestionSet(bad);
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.includes('must be optional:true'))).toBe(true);
  });

  test("at most one multi and one text", () => {
    const twoMulti = {
      ...validQuestionSet,
      questions: [
        validQuestionSet.questions[0],
        { id: "q2", prompt: "a", type: "multi" as const, options: [{ id: "a", label: "A" }] },
        { id: "q3", prompt: "b", type: "multi" as const, options: [{ id: "b", label: "B" }] },
        validQuestionSet.questions[3],
      ],
    };
    const r = validateQuestionSet(twoMulti);
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.includes('at most one "multi"'))).toBe(true);
  });

  test("duplicate question ids are rejected", () => {
    const dup = {
      ...validQuestionSet,
      questions: validQuestionSet.questions.map((q) => ({ ...q, id: "q1" })),
    };
    expect(validateQuestionSet(dup).ok).toBe(false);
  });

  test("rejects non-object / junk input without throwing", () => {
    expect(validateQuestionSet(null).ok).toBe(false);
    expect(validateQuestionSet("nope").ok).toBe(false);
    expect(validateQuestionSet({ questions: "x" }).ok).toBe(false);
  });
});

describe("AC-INT-2 — branch derives from Q1 rating", () => {
  for (const [rating, branch] of ratingBranches) {
    test(`rating ${rating} → ${branch}`, () => {
      expect(branchForRating(rating)).toBe(branch);
    });
  }

  test("a 2★ user never lands in the 'good' branch (sentiment fidelity at input)", () => {
    expect(branchForRating(2)).not.toBe("good");
    expect(branchForRating(1)).not.toBe("good");
  });
});
