import { z } from "zod";

/** Validators for the JSON the model emits via tool calls. */

export const optionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
});

export const questionSchema = z.object({
  id: z.string().min(1),
  prompt: z.string().min(1),
  type: z.enum(["rating", "single", "multi", "text"]),
  options: z.array(optionSchema).optional(),
  optional: z.boolean().optional(),
  helpText: z.string().optional(),
});

export const generatedQuestionsSchema = z.object({
  questions: z.array(questionSchema).min(2).max(5),
});

export const reviewSummarySchema = z.object({
  summary: z.string(),
  themes: z.array(z.string()).default([]),
});

export const generatedReviewSchema = z.object({
  review: z.string().min(1),
});

export type GeneratedQuestions = z.infer<typeof generatedQuestionsSchema>;
export type GeneratedReviewSummary = z.infer<typeof reviewSummarySchema>;
