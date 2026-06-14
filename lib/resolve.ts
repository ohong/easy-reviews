import "server-only";
import { searchPlaces, type LocationBias } from "@/lib/places";

/**
 * Parse + resolve a pasted Google Maps URL (or raw business name) to a place_id.
 * This is the flakiest surface in the product (hex feature ids ≠ place_id,
 * coords-only URLs, renamed places) — so the contract is conservative: we return
 * a best-effort place_id OR a search `query` to prefill the manual fallback, and
 * the UI ALWAYS shows a confirmation card before doing any work (FR-1.4).
 */

export interface ParsedMapsUrl {
  placeId?: string;
  name?: string;
  lat?: number;
  lng?: number;
  kind: "place" | "directions" | "search" | "unknown";
}

export interface ResolveResult {
  /** A place_id we're confident enough to route to a confirmation card. */
  placeId?: string;
  /** Fallback search text to prefill manual search. */
  query?: string;
  /** Human-friendly reason when we can't resolve at all. */
  reason?: string;
}

const SHORT_LINK_HOSTS = new Set([
  "maps.app.goo.gl",
  "goo.gl",
  "g.co",
  "maps.google.com",
]);

function decodeName(raw: string): string {
  try {
    return decodeURIComponent(raw.replace(/\+/g, " ")).trim();
  } catch {
    return raw.replace(/\+/g, " ").trim();
  }
}

/** Pull a place_id / name / coords out of an (already-expanded) Maps URL. */
export function parseMapsUrl(input: string): ParsedMapsUrl {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    // Not a URL — treat the whole thing as a search query.
    return { name: input.trim(), kind: "search" };
  }

  const href = url.href;
  const path = url.pathname;

  // Direct place_id in a query param (most reliable).
  const idParam =
    url.searchParams.get("query_place_id") ??
    url.searchParams.get("place_id") ??
    url.searchParams.get("placeid");
  if (idParam) {
    return { placeId: idParam, kind: "place" };
  }

  // Coordinates: @lat,lng (or !3dlat!4dlng).
  let lat: number | undefined;
  let lng: number | undefined;
  const at = href.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (at) {
    lat = Number(at[1]);
    lng = Number(at[2]);
  } else {
    const d3 = href.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (d3) {
      lat = Number(d3[1]);
      lng = Number(d3[2]);
    }
  }

  if (path.includes("/maps/dir")) {
    return { lat, lng, kind: "directions" };
  }

  // /maps/place/<name>/...
  const placeMatch = path.match(/\/maps\/place\/([^/@]+)/);
  if (placeMatch) {
    return { name: decodeName(placeMatch[1]), lat, lng, kind: "place" };
  }

  // /maps/search/<name> or ?q=<name>
  const searchMatch = path.match(/\/maps\/search\/([^/@]+)/);
  const q = url.searchParams.get("q") ?? url.searchParams.get("query");
  if (searchMatch) return { name: decodeName(searchMatch[1]), lat, lng, kind: "search" };
  if (q) return { name: decodeName(q), lat, lng, kind: "search" };

  return { lat, lng, kind: lat != null ? "place" : "unknown" };
}

/** Follow short-link redirects to the canonical Maps URL. */
async function expandShortLink(input: string): Promise<string> {
  try {
    const res = await fetch(input, {
      method: "GET",
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; EasyReviews/1.0)" },
      cache: "no-store",
    });
    return res.url || input;
  } catch {
    return input;
  }
}

function isShortLink(input: string): boolean {
  try {
    const u = new URL(input);
    if (!SHORT_LINK_HOSTS.has(u.hostname)) return false;
    // maps.app.goo.gl / goo.gl/maps are always short; maps.google.com only if it's a share link.
    if (u.hostname === "maps.app.goo.gl") return true;
    if (u.hostname === "goo.gl") return u.pathname.startsWith("/maps");
    if (u.hostname === "g.co") return true;
    return false;
  } catch {
    return false;
  }
}

function looksLikePlaceId(s: string): boolean {
  // Opaque, but real ones are long and url-safe; reject obvious non-ids.
  return /^[A-Za-z0-9_-]{20,}$/.test(s);
}

/** End-to-end: a pasted URL or raw text → a place_id (best effort) or a query. */
export async function resolveMapsInput(input: string): Promise<ResolveResult> {
  const trimmed = input.trim();
  if (!trimmed) return { reason: "Paste a Google Maps link or type a business name." };

  // Bare place_id pasted directly.
  if (!trimmed.includes("/") && !trimmed.includes(" ") && looksLikePlaceId(trimmed)) {
    return { placeId: trimmed };
  }

  let working = trimmed;
  if (isShortLink(trimmed)) {
    working = await expandShortLink(trimmed);
  }

  const parsed = parseMapsUrl(working);

  if (parsed.placeId) return { placeId: parsed.placeId };

  if (parsed.kind === "directions") {
    return {
      reason:
        "That looks like a directions link. Paste the link to the business's place page instead.",
    };
  }

  const bias: LocationBias | undefined =
    parsed.lat != null && parsed.lng != null
      ? { lat: parsed.lat, lng: parsed.lng, radius: 2000 }
      : undefined;

  if (parsed.name) {
    const candidates = await searchPlaces(parsed.name, { bias, limit: 1 });
    if (candidates[0]) return { placeId: candidates[0].placeId, query: parsed.name };
    return { query: parsed.name };
  }

  return {
    reason:
      "We couldn't read a business from that link. Try searching for it by name.",
  };
}
