// §4 Review generation & integrity (the non-negotiable core).
// The pure guards run NOW. The model-output scenarios are test.todo until the
// generation service is wired — at which point each todo gets the real call +
// these same guards applied to the live output.
import { describe, expect, test } from "bun:test";
import {
  buildWriteReviewUrl,
  findAiTells,
  findForbiddenInventions,
  isWithinLengthBounds,
  wordCount,
} from "./support/review";
import { aiTellDenylist, forbiddenInventions, WRITE_REVIEW_BASE } from "./support/fixtures";

describe("AC-GEN-1 — length bounds (pure guard, runnable now)", () => {
  test("counts words and enforces 40–80", () => {
    const tooShort = "Great place, loved it.";
    const inRange = Array.from({ length: 55 }, (_, i) => `word${i}`).join(" ");
    const tooLong = Array.from({ length: 120 }, (_, i) => `word${i}`).join(" ");
    expect(wordCount(tooShort)).toBeLessThan(40);
    expect(isWithinLengthBounds(tooShort)).toBe(false);
    expect(isWithinLengthBounds(inRange)).toBe(true);
    expect(isWithinLengthBounds(tooLong)).toBe(false);
  });
});

describe("AC-GEN-2 — grounding guard (pure, runnable now)", () => {
  test("flags invented facts", () => {
    const leaky = "Loved the tiramisu and our server Maria was great.";
    const leaks = findForbiddenInventions(leaky, forbiddenInventions);
    expect(leaks).toContain("Tiramisu");
    expect(leaks).toContain("Maria");
  });
  test("passes a grounded review", () => {
    const grounded = "The carbonara was excellent and the patio stayed quiet — friendly service throughout.";
    expect(findForbiddenInventions(grounded, forbiddenInventions)).toEqual([]);
  });
});

describe("AC-GEN-6 — natural voice denylist (pure, runnable now)", () => {
  test("flags AI-tell phrasing", () => {
    expect(findAiTells("As an AI, I would say 5/5 stars.", aiTellDenylist).length).toBeGreaterThan(0);
  });
  test("passes natural phrasing", () => {
    expect(findAiTells("Quick, friendly, and the coffee was excellent.", aiTellDenylist)).toEqual([]);
  });
});

describe("AC-OUT-3 — write-review deep link (pure, runnable now)", () => {
  test("builds the exact Google URL with the place_id", () => {
    expect(buildWriteReviewUrl("ChIJ123")).toBe(`${WRITE_REVIEW_BASE}ChIJ123`);
  });
  test("requires a place_id (fails noisily)", () => {
    expect(() => buildWriteReviewUrl("")).toThrow();
  });
});

// ---- Model-output scenarios (wire to the live generation service) ----
describe("AC-GEN — model output (integration)", () => {
  test.todo("AC-GEN-1: live review is 40–80 words, exactly one review", async () => {
    // const out = await generateReview(answerSets.positiveRestaurant);
    // expect(isWithinLengthBounds(out.text)).toBe(true);
  });
  test.todo("AC-GEN-2: live output contains no fact outside answers + business", async () => {
    // const out = await generateReview(answerSets.positiveRestaurant);
    // expect(findForbiddenInventions(out.text, forbiddenInventions)).toEqual([]);
    // nightly: LLM-judge lists any entity not in {answers, business} → expect empty
  });
  test.todo("AC-GEN-3: rating-2 output reads critical, names only supplied complaints");
  test.todo("AC-GEN-4: rating-5 output is enthusiastic, not softened");
  test.todo("AC-GEN-5: rating-3 output holds both the positive and the negative");
  test.todo("AC-GEN-6: two answer sets do not produce structurally identical drafts");
  test.todo("AC-GEN-7: regenerate yields a different draft still meeting GEN-1/-2/-3");
  test.todo("AC-GEN-8: generation failure shows recoverable error, answers preserved, logged");
});
