import { describe, expect, test } from "bun:test";
import {
  answerValueSchema,
  generateReviewInputSchema,
  interviewAnswerSchema,
} from "@/lib/validations";

const validInput = {
  placeId: "ChIJ_abc",
  rating: 5,
  answers: [
    { questionId: "q_rating", prompt: "Overall?", type: "rating", value: 5 },
    {
      questionId: "q_stood_out",
      prompt: "What stood out?",
      type: "multi",
      value: ["coffee", "service"],
      labels: ["Coffee", "Service"],
    },
  ],
  sessionId: "sess_123",
};

describe("generateReviewInputSchema", () => {
  test("accepts a well-formed payload", () => {
    expect(generateReviewInputSchema.safeParse(validInput).success).toBe(true);
  });

  test("rejects rating out of 1–5 range", () => {
    expect(
      generateReviewInputSchema.safeParse({ ...validInput, rating: 0 }).success,
    ).toBe(false);
    expect(
      generateReviewInputSchema.safeParse({ ...validInput, rating: 6 }).success,
    ).toBe(false);
  });

  test("rejects a non-integer rating", () => {
    expect(
      generateReviewInputSchema.safeParse({ ...validInput, rating: 4.5 }).success,
    ).toBe(false);
  });

  test("requires a non-empty placeId", () => {
    expect(
      generateReviewInputSchema.safeParse({ ...validInput, placeId: "" }).success,
    ).toBe(false);
  });

  test("caps answers at 20", () => {
    const answers = Array.from({ length: 21 }, (_, i) => ({
      questionId: `q${i}`,
      prompt: "p",
      type: "text" as const,
      value: "x",
    }));
    expect(
      generateReviewInputSchema.safeParse({ ...validInput, answers }).success,
    ).toBe(false);
  });

  test("sessionId is optional", () => {
    const { sessionId: _omit, ...noSession } = validInput;
    void _omit;
    expect(generateReviewInputSchema.safeParse(noSession).success).toBe(true);
  });
});

describe("answerValueSchema / interviewAnswerSchema", () => {
  test("answer value accepts number, string, or string[]", () => {
    expect(answerValueSchema.safeParse(5).success).toBe(true);
    expect(answerValueSchema.safeParse("espresso").success).toBe(true);
    expect(answerValueSchema.safeParse(["a", "b"]).success).toBe(true);
    expect(answerValueSchema.safeParse({ nope: true }).success).toBe(false);
  });

  test("interview answer requires questionId, prompt, type, value", () => {
    expect(
      interviewAnswerSchema.safeParse({ questionId: "q", prompt: "p" }).success,
    ).toBe(false);
    expect(
      interviewAnswerSchema.safeParse({
        questionId: "q",
        prompt: "p",
        type: "single",
        value: "x",
      }).success,
    ).toBe(true);
  });

  test("rejects an unknown question type", () => {
    expect(
      interviewAnswerSchema.safeParse({
        questionId: "q",
        prompt: "p",
        type: "slider",
        value: 1,
      }).success,
    ).toBe(false);
  });
});
