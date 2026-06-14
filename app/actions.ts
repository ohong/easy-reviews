"use server";

import { redirect } from "next/navigation";
import { resolveMapsInput } from "@/lib/resolve";

export type ResolveState = { error?: string } | null;

/**
 * Entry resolver: a pasted Maps URL (or business name) → the confirmation card,
 * or the manual search page when we can't pin it down. Used via useActionState.
 */
export async function resolveUrlAction(
  _prev: ResolveState,
  formData: FormData,
): Promise<ResolveState> {
  const input = String(formData.get("url") ?? "").trim();
  if (!input)
    return { error: "Paste a Google Maps link or type a business name." };

  let target: string;
  try {
    const res = await resolveMapsInput(input);
    if (res.placeId) {
      target = `/review/${encodeURIComponent(res.placeId)}?confirm=1`;
    } else if (res.query) {
      target = `/start?q=${encodeURIComponent(res.query)}`;
    } else {
      return {
        error: res.reason ?? "We couldn't read that — try searching by name.",
      };
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("GOOGLE_API_KEY")) {
      return {
        error: "Business lookup isn't configured yet (missing Google API key).",
      };
    }
    return { error: "Something went wrong. Try searching by name instead." };
  }
  // redirect() throws NEXT_REDIRECT — must be outside the try/catch.
  redirect(target);
}
