import { z } from "zod";

/** Zod schemas shared by Server Actions (input is always attacker-controlled). */

export const answerValueSchema = z.union([
  z.number(),
  z.string(),
  z.array(z.string()),
]);

export const interviewAnswerSchema = z.object({
  questionId: z.string().min(1),
  prompt: z.string().min(1),
  type: z.enum(["rating", "single", "multi", "text"]),
  value: answerValueSchema,
  labels: z.array(z.string()).optional(),
});

export const generateReviewInputSchema = z.object({
  placeId: z.string().min(1).max(300),
  rating: z.number().int().min(1).max(5),
  answers: z.array(interviewAnswerSchema).max(20),
  sessionId: z.string().max(100).optional(),
});

export type GenerateReviewInput = z.infer<typeof generateReviewInputSchema>;
