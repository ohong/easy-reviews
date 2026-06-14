import { describe, expect, test } from "bun:test";
import { finalizeQuestionSet } from "@/lib/ai/generate";
import type { Question } from "@/lib/types";

const followups: Question[] = [
  { id: "q_stood_out", prompt: "What stood out?", type: "multi", options: [] },
  { id: "q_order", prompt: "What did you get?", type: "single", options: [] },
  { id: "q_more", prompt: "Anything else?", type: "text", optional: true },
];

describe("finalizeQuestionSet (B↔C contract)", () => {
  test("prepends exactly one rating question naming the business", () => {
    const qs = finalizeQuestionSet("Blue Bottle", "Coffee shop", followups);
    expect(qs.questions[0].type).toBe("rating");
    expect(qs.questions[0].prompt).toContain("Blue Bottle");
    expect(qs.questions.filter((q) => q.type === "rating")).toHaveLength(1);
  });

  test("drops any stray rating question the model emitted", () => {
    const withStray: Question[] = [
      { id: "q_extra_rating", prompt: "Rate it", type: "rating" },
      ...followups,
    ];
    const qs = finalizeQuestionSet("X", "Cafe", withStray);
    expect(qs.questions.filter((q) => q.type === "rating")).toHaveLength(1);
    expect(qs.questions[0].id).toBe("q_rating");
  });

  test("caps follow-ups at 4 (5 questions total max)", () => {
    const many: Question[] = Array.from({ length: 8 }, (_, i) => ({
      id: `q${i}`,
      prompt: `Q${i}`,
      type: "single" as const,
      options: [],
    }));
    const qs = finalizeQuestionSet("X", "Cafe", many);
    expect(qs.questions).toHaveLength(5);
    expect(qs.questions[0].type).toBe("rating");
  });

  test("preserves follow-up order and sets businessName + category", () => {
    const qs = finalizeQuestionSet("Joe's", "Pizza", followups);
    expect(qs.businessName).toBe("Joe's");
    expect(qs.category).toBe("Pizza");
    expect(qs.questions.slice(1).map((q) => q.id)).toEqual([
      "q_stood_out",
      "q_order",
      "q_more",
    ]);
  });

  test("handles an empty model output (rating gate only)", () => {
    const qs = finalizeQuestionSet("X", "Cafe", []);
    expect(qs.questions).toHaveLength(1);
    expect(qs.questions[0].type).toBe("rating");
  });
});
