"use server";

import { z } from "zod";
import { autocompletePlaces, type PlaceSuggestion } from "@/lib/places";

const querySchema = z.string().min(2).max(200);

export type SearchState =
  | { ok: true; suggestions: PlaceSuggestion[] }
  | { ok: false; error: string };

/** Type-ahead business search for the manual fallback + business self-serve. */
export async function searchBusinessesAction(
  query: string,
): Promise<SearchState> {
  const parsed = querySchema.safeParse(query.trim());
  if (!parsed.success) return { ok: true, suggestions: [] };
  try {
    const suggestions = await autocompletePlaces(parsed.data);
    return { ok: true, suggestions };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("GOOGLE_API_KEY")) {
      return { ok: false, error: "Search isn't configured (missing Google API key)." };
    }
    return { ok: false, error: "Search failed — please try again." };
  }
}
