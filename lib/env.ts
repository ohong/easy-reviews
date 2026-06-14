import "server-only";
import { z } from "zod";

/**
 * Server-side environment. Parsed once at module load so a malformed value
 * fails loudly instead of surfacing as `undefined` deep in a request.
 *
 * Core feature keys (Anthropic, Google) are optional *at boot* so the landing
 * page and `next build` work without them — but calling a feature without its
 * key throws a clear, actionable error (see `require*` helpers below). Auth keys
 * are fully optional: the app is anonymous-first.
 */
const schema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // Core flow
  ANTHROPIC_API_KEY: z.string().min(1).optional(),
  ANTHROPIC_MODEL: z.string().min(1).default("claude-opus-4-8"),
  GOOGLE_API_KEY: z.string().min(1).optional(),

  // Image generation (fal.ai — counter-sign concept previews)
  FAL_KEY: z.string().min(1).optional(),

  // Persistence
  DATABASE_URL: z.string().min(1).default("file:./data/app.db"),

  // Optional: accounts & saved history
  BETTER_AUTH_SECRET: z.string().min(1).optional(),
  BETTER_AUTH_URL: z.string().min(1).default("http://localhost:3000"),
  GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),

  // Public base URL for copy/QR links (also readable client-side via process.env)
  NEXT_PUBLIC_APP_URL: z.string().min(1).default("http://localhost:3000"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((i) => `  • ${i.path.join(".") || "(root)"}: ${i.message}`)
    .join("\n");
  // eslint-disable-next-line no-console
  console.error(`\n❌ Invalid environment variables:\n${details}\n`);
  throw new Error("Invalid environment variables — see logs above.");
}

export const env = parsed.data;

/** Which optional capabilities are configured (used to gate UI/features). */
export const features = {
  /** Review + question-set generation. */
  anthropic: Boolean(env.ANTHROPIC_API_KEY),
  /** Places resolution / details / autocomplete. */
  places: Boolean(env.GOOGLE_API_KEY),
  /** Google login + saved history. */
  googleAuth: Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
  /** fal.ai counter-sign concept generation. */
  imageGeneration: Boolean(env.FAL_KEY),
} as const;

export function requireAnthropicKey(): string {
  if (!env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to .env to enable review generation.",
    );
  }
  return env.ANTHROPIC_API_KEY;
}

export function requireGoogleKey(): string {
  if (!env.GOOGLE_API_KEY) {
    throw new Error(
      "GOOGLE_API_KEY is not set. Add it to .env (enable 'Places API (New)') to resolve businesses.",
    );
  }
  return env.GOOGLE_API_KEY;
}

export function requireFalKey(): string {
  if (!env.FAL_KEY) {
    throw new Error(
      "FAL_KEY is not set. Add it to .env to enable counter-sign generation.",
    );
  }
  return env.FAL_KEY;
}

/** Public app URL, normalized without a trailing slash. */
export const appUrl = (
  env.NEXT_PUBLIC_APP_URL || env.BETTER_AUTH_URL
).replace(/\/$/, "");
