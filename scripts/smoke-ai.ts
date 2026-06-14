/**
 * Live smoke-test for the AI core (HANDOFF §6.A). Run with:
 *   bun run scripts/smoke-ai.ts ["Business search query"]
 *
 * Exercises the real Google Places (New) + Anthropic forced-tool-use paths:
 * resolve a business → pull reviews → internal summary → tailored question set →
 * grounded review for BOTH a 5★ (positive) and a 2★ (negative) scenario, then
 * checks the integrity invariants (grounding/sentiment/form). Not a unit test —
 * it hits live APIs and prints what came back so a human can eyeball quality.
 */
import { searchPlaces, getPlaceDetails } from "@/lib/places";
import {
  generateReviewSummary,
  generateQuestionSet,
  generateReview,
} from "@/lib/ai/generate";
import type { InterviewAnswers, QuestionSet } from "@/lib/types";

const BANNED = [
  "hidden gem",
  "highly recommend",
  "a must",
  "top notch",
  "second to none",
];

function wordCount(s: string) {
  return s.trim().split(/\s+/).length;
}

/** Fabricate plausible answers from a generated question set for one sentiment. */
function fakeAnswers(qs: QuestionSet, mood: "good" | "bad"): InterviewAnswers {
  const answers: InterviewAnswers = [];
  for (const q of qs.questions) {
    if (q.type === "rating") continue;
    if (q.type === "multi") {
      const picked = (q.options ?? []).slice(0, 2);
      answers.push({
        questionId: q.id,
        prompt: q.prompt,
        type: "multi",
        value: picked.map((o) => o.id),
        labels: picked.map((o) => o.label),
      });
    } else if (q.type === "single") {
      const pick = (q.options ?? [])[0];
      if (pick)
        answers.push({
          questionId: q.id,
          prompt: q.prompt,
          type: "single",
          value: pick.id,
          labels: [pick.label],
        });
    } else {
      answers.push({
        questionId: q.id,
        prompt: q.prompt,
        type: "text",
        value:
          mood === "good"
            ? "Friendly staff and the order came out fast. I'll be back."
            : "Waited about 25 minutes and my order came out wrong twice. Staff seemed overwhelmed.",
      });
    }
  }
  return answers;
}

function checkReview(label: string, text: string) {
  const wc = wordCount(text);
  const issues: string[] = [];
  if (wc < 30 || wc > 95) issues.push(`word count ${wc} outside ~40-80`);
  for (const b of BANNED)
    if (text.toLowerCase().includes(b)) issues.push(`cliché: "${b}"`);
  if (/[★*]/.test(text)) issues.push("contains star/asterisk symbol");
  if (/^["'].*["']$/.test(text.trim())) issues.push("wrapped in quotes");
  console.log(`\n  [${label}] (${wc} words)`);
  console.log(`  "${text}"`);
  if (issues.length) console.log(`  ⚠️  ${issues.join("; ")}`);
  else console.log(`  ✅ passes basic integrity checks`);
  return issues.length === 0;
}

async function main() {
  const query = process.argv[2] ?? "Blue Bottle Coffee Ferry Building San Francisco";
  console.log(`\n=== AI SMOKE TEST ===\nResolving: "${query}"`);

  const results = await searchPlaces(query, { limit: 1 });
  if (!results.length) throw new Error("No business found for query");
  const business = results[0];
  console.log(
    `Resolved: ${business.name} — ${business.category ?? "?"} — ${business.address ?? "?"}\n  placeId=${business.placeId} rating=${business.rating ?? "?"}`,
  );

  const details = await getPlaceDetails(business.placeId);
  console.log(`Pulled ${details.reviews.length} review(s).`);

  console.log("\n--- generateReviewSummary ---");
  const summary = await generateReviewSummary(business, details.reviews);
  console.log("summary:", summary.summary || "(none)");
  console.log("themes:", summary.themes.join(", ") || "(none)");

  console.log("\n--- generateQuestionSet ---");
  const qs = await generateQuestionSet(business, summary);
  console.log(`businessName=${qs.businessName} category=${qs.category}`);
  qs.questions.forEach((q, i) => {
    const opts = q.options ? ` [${q.options.map((o) => o.label).join(" | ")}]` : "";
    console.log(`  Q${i + 1} (${q.type}${q.optional ? ", optional" : ""}): ${q.prompt}${opts}`);
  });
  const contractOk =
    qs.questions[0]?.type === "rating" &&
    qs.questions.length >= 2 &&
    qs.questions.length <= 5 &&
    qs.questions.slice(1).every((q) => q.type !== "rating");
  console.log(contractOk ? "  ✅ question contract OK" : "  ⚠️  question contract VIOLATED");

  console.log("\n--- generateReview (5★ positive) ---");
  const pos = await generateReview({
    business: { name: business.name, category: qs.category },
    rating: 5,
    answers: fakeAnswers(qs, "good"),
  });
  const posOk = checkReview("5★", pos);

  console.log("\n--- generateReview (2★ negative) ---");
  const neg = await generateReview({
    business: { name: business.name, category: qs.category },
    rating: 2,
    answers: fakeAnswers(qs, "bad"),
  });
  const negOk = checkReview("2★", neg);

  console.log("\n--- regenerate (avoid prior 5★) ---");
  const regen = await generateReview({
    business: { name: business.name, category: qs.category },
    rating: 5,
    answers: fakeAnswers(qs, "good"),
    avoid: pos,
  });
  const regenOk = checkReview("5★ regen", regen);
  if (regen.trim() === pos.trim()) console.log("  ⚠️  regen identical to original");

  const allOk = contractOk && posOk && negOk && regenOk;
  console.log(`\n=== SMOKE TEST ${allOk ? "PASSED ✅" : "HAD WARNINGS ⚠️"} ===\n`);
  if (!allOk) process.exit(1);
}

main().catch((err) => {
  console.error("\n❌ SMOKE TEST FAILED:", err);
  process.exit(1);
});
