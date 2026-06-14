import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { env, requireAnthropicKey } from "@/lib/env";

let client: Anthropic | null = null;

/** Lazily-constructed Anthropic client (throws a clear error if the key is absent). */
export function anthropic(): Anthropic {
  if (!client) client = new Anthropic({ apiKey: requireAnthropicKey() });
  return client;
}

/** Default model — latest Opus, overridable via ANTHROPIC_MODEL. */
export const MODEL = env.ANTHROPIC_MODEL;
