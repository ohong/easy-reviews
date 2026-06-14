import "server-only";
import type Anthropic from "@anthropic-ai/sdk";
import { anthropic, MODEL } from "@/lib/anthropic";
import type { PlaceReview } from "@/lib/places";
import type {
  InterviewAnswers,
  Question,
  QuestionSet,
  ResolvedBusiness,
} from "@/lib/types";
import { ratingBranch } from "@/lib/types";
import {
  generatedQuestionsSchema,
  generatedReviewSchema,
  reviewSummarySchema,
} from "./schemas";

/**
 * Run a single forced-tool-call and validate its JSON input. Forcing the tool
 * is the most reliable way to get structured output across models — the SDK
 * returns the tool input already parsed; we validate it with Zod and retry once.
 */
async function runToolJSON<T>(args: {
  system: string;
  user: string;
  toolName: string;
  toolDescription: string;
  inputSchema: Anthropic.Tool.InputSchema;
  validate: (data: unknown) => T;
  maxTokens: number;
}): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    const message = await anthropic().messages.create({
      model: MODEL,
      max_tokens: args.maxTokens,
      system: args.system,
      tools: [
        {
          name: args.toolName,
          description: args.toolDescription,
          input_schema: args.inputSchema,
        },
      ],
      tool_choice: { type: "tool", name: args.toolName },
      messages: [
        {
          role: "user",
          content:
            attempt === 0
              ? args.user
              : `${args.user}\n\n(Your previous output was invalid. Return ONLY a valid ${args.toolName} call that matches the schema exactly.)`,
        },
      ],
    });
    const block = message.content.find((b) => b.type === "tool_use");
    if (block && block.type === "tool_use") {
      try {
        return args.validate(block.input);
      } catch (err) {
        lastErr = err;
        continue;
      }
    }
    lastErr = new Error("Model did not return a tool call");
  }
  throw lastErr instanceof Error
    ? lastErr
    : new Error("Structured generation failed");
}

// ── Review summary (internal nudge for question relevance) ────────────────────

const SUMMARY_SYSTEM =
  "You read a business's recent Google reviews and write a tight, neutral internal note that will help tailor a short customer interview. Be factual and even-handed; capture recurring themes customers mention (e.g. food, service, wait times, value, ambiance, cleanliness) without taking a side. This note is internal — not shown to anyone.";

export async function generateReviewSummary(
  business: ResolvedBusiness,
  reviews: PlaceReview[],
): Promise<{ summary: string; themes: string[] }> {
  if (reviews.length === 0) return { summary: "", themes: [] };

  const reviewLines = reviews
    .map(
      (r, i) =>
        `${i + 1}. (${r.rating ?? "?"}/5) ${r.text.replace(/\s+/g, " ").slice(0, 400)}`,
    )
    .join("\n");

  const user = `Business: ${business.name}${
    business.category ? ` (${business.category})` : ""
  }\nRecent reviews:\n${reviewLines}\n\nSummarize the recurring themes in 1–2 sentences and list 3–6 short lowercase theme tags.`;

  // NB: claude-opus-4-8 mangles forced tool calls that have multiple top-level
  // properties — it leaks its internal `</parameter>` separator into the first
  // field and drops the rest. Tools with a SINGLE top-level property serialize
  // cleanly (see emit_questions/emit_review), so we nest both fields under one.
  return runToolJSON({
    system: SUMMARY_SYSTEM,
    user,
    toolName: "emit_summary",
    toolDescription: "Record the internal review summary and theme tags.",
    inputSchema: {
      type: "object",
      properties: {
        note: {
          type: "object",
          properties: {
            summary: { type: "string" },
            themes: { type: "array", items: { type: "string" } },
          },
          required: ["summary", "themes"],
          additionalProperties: false,
        },
      },
      required: ["note"],
      additionalProperties: false,
    },
    validate: (d) =>
      reviewSummarySchema.parse((d as { note?: unknown } | null)?.note),
    maxTokens: 400,
  });
}

// ── Question-set generation (cached per business) ─────────────────────────────

const QUESTIONS_SYSTEM = `You design a SHORT multiple-choice interview that helps a real customer recall and articulate their genuine experience at a specific business. Their answers will be used to ghostwrite an honest review in their own words, so the questions must surface concrete, specific details — without assuming the visit was good or bad.

Rules:
- Generate 3–4 questions. Do NOT include an overall rating question (one is added separately).
- Keep every prompt SENTIMENT-NEUTRAL — it must read naturally whether the visit was great, mixed, or poor. Avoid loaded words like "enjoy", "love", "favorite", "delicious", "amazing", "problem", or "complaint". Prefer neutral framings such as "What did you get?" or "What stood out?".
- Tailor questions and options to the category and the provided review themes.
- Include exactly ONE multi-select question (type "multi") titled like "What stood out?" with 4–6 short, category-relevant options that work for praise OR criticism (e.g. for a restaurant: Food, Service, Value, Ambiance, Speed, Cleanliness).
- Include one single-select question (type "single") capturing a concrete specific (e.g. "What did you order?") with a few common category options.
- The LAST question must be optional free text (type "text", optional: true), e.g. "Anything else a future customer should know?".
- ids are short slugs (q_stood_out, q_order, q_more). Option ids are short slugs; labels are 1–3 words.
- The whole interview must be answerable in under 60 seconds.

Emit the questions via the emit_questions tool.`;

const QUESTION_INPUT_SCHEMA: Anthropic.Tool.InputSchema = {
  type: "object",
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          prompt: { type: "string" },
          type: { type: "string", enum: ["single", "multi", "text"] },
          options: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                label: { type: "string" },
              },
              required: ["id", "label"],
              additionalProperties: false,
            },
          },
          optional: { type: "boolean" },
          helpText: { type: "string" },
        },
        required: ["id", "prompt", "type"],
        additionalProperties: false,
      },
    },
  },
  required: ["questions"],
  additionalProperties: false,
};

export async function generateQuestionSet(
  business: ResolvedBusiness,
  nudge: { summary: string; themes: string[] },
): Promise<QuestionSet> {
  const category =
    business.category ?? prettifyType(business.primaryType) ?? "business";

  const user = `Business: ${business.name}\nCategory: ${category}${
    business.primaryType ? ` (type: ${business.primaryType})` : ""
  }\n${
    nudge.summary
      ? `What recent reviewers tend to mention: ${nudge.summary}${
          nudge.themes.length ? ` [themes: ${nudge.themes.join(", ")}]` : ""
        }`
      : "No recent reviews available — use sensible defaults for this category."
  }\n\nDesign the interview now.`;

  const generated = await runToolJSON({
    system: QUESTIONS_SYSTEM,
    user,
    toolName: "emit_questions",
    toolDescription: "Emit the tailored interview questions.",
    inputSchema: QUESTION_INPUT_SCHEMA,
    validate: (d) => generatedQuestionsSchema.parse(d),
    maxTokens: 1500,
  });

  // Guarantee the B↔C contract (pure + unit-tested below).
  return finalizeQuestionSet(business.name, category, generated.questions);
}

/**
 * Enforce the question-set contract regardless of what the model emitted:
 * exactly one rating gate first, then up to 4 non-rating follow-ups (any stray
 * model-emitted rating is dropped), so 2–5 questions total. Pure → unit-tested.
 */
export function finalizeQuestionSet(
  businessName: string,
  category: string,
  generatedQuestions: Question[],
): QuestionSet {
  const ratingQuestion: Question = {
    id: "q_rating",
    prompt: `Overall, how was ${businessName}?`,
    type: "rating",
  };
  const followups = generatedQuestions
    .filter((q) => q.type !== "rating")
    .slice(0, 4);
  return {
    businessName,
    category,
    questions: [ratingQuestion, ...followups],
  };
}

// ── Review generation (the ghostwriter) ───────────────────────────────────────

const REVIEW_SYSTEM = `You are a ghostwriter helping a real customer turn their interview answers into ONE honest Google review, written in their own voice. You are a ghostwriter, not an author — you may only use facts the customer actually provided (plus the business name and category).

Hard rules:
1. GROUNDING: Use only the details in the answers, plus the business name and category. Never invent dishes, names, people, dates, prices, times, events, or any specific the customer did not give. If a detail wasn't provided, leave it out — do not guess or embellish.
2. SENTIMENT FIDELITY: Match the customer's star rating exactly. Never inflate a negative experience into praise or soften a rave into faint approval. 5★ = clearly enthusiastic; 4★ = positive, minor reservations only if they mentioned one; 3★ = genuinely mixed and balanced; 2★ = disappointed but fair and specific; 1★ = clearly negative, factual, and civil (never abusive, no slurs, no threats, no calls to harass staff).
3. VOICE: Sound like a real person, not marketing copy or AI. Vary sentence length. No clichés ("hidden gem", "highly recommend", "a must", "top notch", "second to none"), no hashtags, no emoji, no surrounding quotation marks, no greetings or sign-offs, no star symbols. Do not mention that this is a review or that it was AI-assisted.
4. FORM: 2–4 sentences, about 40–80 words. Skimmable and useful to a future customer. Mention the business name at most once, naturally. First person.

Emit only the finished review text via the emit_review tool.`;

function renderAnswers(answers: InterviewAnswers): string {
  const lines: string[] = [];
  for (const a of answers) {
    if (a.type === "rating") continue;
    if (a.type === "multi") {
      const labels = a.labels?.length
        ? a.labels
        : Array.isArray(a.value)
          ? (a.value as string[])
          : [];
      if (labels.length) lines.push(`- ${a.prompt}: ${labels.join(", ")}`);
    } else if (a.type === "single") {
      const label = a.labels?.[0] ?? String(a.value ?? "");
      if (label.trim()) lines.push(`- ${a.prompt}: ${label}`);
    } else {
      const text = String(a.value ?? "").trim();
      if (text) lines.push(`- ${a.prompt}: ${text}`);
    }
  }
  return lines.length ? lines.join("\n") : "- (no extra details were given)";
}

export async function generateReview(args: {
  business: { name: string; category: string };
  rating: number;
  answers: InterviewAnswers;
  /** Previous draft to differ from, when regenerating. */
  avoid?: string;
}): Promise<string> {
  const branch = ratingBranch(args.rating);
  const user = `Business: ${args.business.name} (${args.business.category})
Overall rating the customer gave: ${args.rating}/5 (${branch}).
What the customer told us:
${renderAnswers(args.answers)}
${
  args.avoid
    ? `\nWrite a fresh take that differs in wording and structure from this earlier draft:\n"${args.avoid.slice(0, 600)}"`
    : ""
}
Write their review now, following every rule.`;

  const result = await runToolJSON({
    system: REVIEW_SYSTEM,
    user,
    toolName: "emit_review",
    toolDescription: "Emit the finished review text.",
    inputSchema: {
      type: "object",
      properties: { review: { type: "string" } },
      required: ["review"],
      additionalProperties: false,
    },
    validate: (d) => generatedReviewSchema.parse(d),
    maxTokens: 500,
  });

  return cleanReview(result.review);
}

function cleanReview(text: string): string {
  let t = text.trim();
  // Strip wrapping quotes the model sometimes adds despite instructions.
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    t = t.slice(1, -1).trim();
  }
  return t;
}

function prettifyType(type: string | null): string | null {
  if (!type) return null;
  return type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
