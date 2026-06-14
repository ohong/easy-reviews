import "server-only";
import { requireGoogleKey } from "@/lib/env";
import type { ResolvedBusiness } from "@/lib/types";

/**
 * Thin server-side client for the Google Places API (New).
 * Host is places.googleapis.com (NOT maps.googleapis.com). Auth + field mask go
 * in headers. Field masks are billed at the highest-SKU field requested, so we
 * keep the resolution mask to Pro-tier fields and only pull `reviews`
 * (Enterprise+Atmosphere) once per business when preparing the interview.
 */

const HOST = "https://places.googleapis.com/v1";

export class PlacesError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "PlacesError";
  }
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface LocationBias extends LatLng {
  /** meters, 0–50000 */
  radius?: number;
}

export interface PlaceReview {
  rating: number | null;
  text: string;
  relativeTime: string | null;
  author: string | null;
}

export interface PlaceDetails extends ResolvedBusiness {
  reviews: PlaceReview[];
}

export interface PlaceSuggestion {
  placeId: string;
  mainText: string;
  secondaryText: string | null;
  fullText: string;
}

type LocalizedText = { text?: string } | undefined;

interface RawPlace {
  id?: string;
  displayName?: LocalizedText;
  formattedAddress?: string;
  location?: { latitude?: number; longitude?: number };
  primaryType?: string;
  primaryTypeDisplayName?: LocalizedText;
  types?: string[];
  rating?: number;
  reviews?: Array<{
    rating?: number;
    text?: LocalizedText;
    relativePublishTimeDescription?: string;
    authorAttribution?: { displayName?: string };
  }>;
}

function circle(bias?: LocationBias) {
  if (!bias) return undefined;
  return {
    circle: {
      center: { latitude: bias.lat, longitude: bias.lng },
      radius: bias.radius ?? 5000,
    },
  };
}

function toBusiness(p: RawPlace): ResolvedBusiness {
  return {
    placeId: p.id ?? "",
    name: p.displayName?.text ?? "Unknown place",
    address: p.formattedAddress ?? null,
    category: p.primaryTypeDisplayName?.text ?? null,
    primaryType: p.primaryType ?? null,
    lat: p.location?.latitude ?? null,
    lng: p.location?.longitude ?? null,
    rating: p.rating ?? null,
  };
}

async function placesFetch<T>(
  path: string,
  init: {
    method: "GET" | "POST";
    fieldMask?: string;
    body?: unknown;
    query?: Record<string, string>;
  },
): Promise<T> {
  const key = requireGoogleKey();
  const url = new URL(`${HOST}${path}`);
  if (init.query) {
    for (const [k, v] of Object.entries(init.query)) url.searchParams.set(k, v);
  }
  const headers: Record<string, string> = { "X-Goog-Api-Key": key };
  if (init.fieldMask) headers["X-Goog-FieldMask"] = init.fieldMask;
  if (init.body) headers["Content-Type"] = "application/json";

  const res = await fetch(url, {
    method: init.method,
    headers,
    body: init.body ? JSON.stringify(init.body) : undefined,
    // Places responses are request-specific; never cache at the fetch layer.
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new PlacesError(
      `Places API ${path} failed (${res.status}): ${detail.slice(0, 300)}`,
      res.status,
    );
  }
  return (await res.json()) as T;
}

const SEARCH_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.primaryType",
  "places.primaryTypeDisplayName",
  "places.types",
  "places.rating",
].join(",");

/** Text Search (New). Returns up to `limit` candidates, best match first. */
export async function searchPlaces(
  textQuery: string,
  opts: { bias?: LocationBias; limit?: number } = {},
): Promise<ResolvedBusiness[]> {
  const data = await placesFetch<{ places?: RawPlace[] }>(
    "/places:searchText",
    {
      method: "POST",
      fieldMask: SEARCH_MASK,
      body: {
        textQuery,
        languageCode: "en",
        pageSize: Math.min(Math.max(opts.limit ?? 5, 1), 20),
        ...(opts.bias ? { locationBias: circle(opts.bias) } : {}),
      },
    },
  );
  return (data.places ?? []).map(toBusiness).filter((b) => b.placeId);
}

const SUMMARY_MASK = [
  "id",
  "displayName",
  "formattedAddress",
  "location",
  "primaryType",
  "primaryTypeDisplayName",
  "types",
  "rating",
].join(",");

/** Place Details (New) WITHOUT reviews — cheap (Pro tier), for the confirm card. */
export async function getPlaceSummary(
  placeId: string,
): Promise<ResolvedBusiness> {
  const p = await placesFetch<RawPlace>(
    `/places/${encodeURIComponent(placeId)}`,
    { method: "GET", fieldMask: SUMMARY_MASK, query: { languageCode: "en" } },
  );
  return toBusiness(p);
}

const DETAILS_MASK = [
  "id",
  "displayName",
  "formattedAddress",
  "location",
  "primaryType",
  "primaryTypeDisplayName",
  "types",
  "rating",
  "reviews",
].join(",");

/** Place Details (New) with up to 5 reviews. */
export async function getPlaceDetails(placeId: string): Promise<PlaceDetails> {
  const p = await placesFetch<RawPlace>(
    `/places/${encodeURIComponent(placeId)}`,
    { method: "GET", fieldMask: DETAILS_MASK, query: { languageCode: "en" } },
  );
  const reviews: PlaceReview[] = (p.reviews ?? [])
    .map((r) => ({
      rating: r.rating ?? null,
      text: r.text?.text?.trim() ?? "",
      relativeTime: r.relativePublishTimeDescription ?? null,
      author: r.authorAttribution?.displayName ?? null,
    }))
    .filter((r) => r.text.length > 0);
  return { ...toBusiness(p), reviews };
}

/** Place Autocomplete (New) — for the business self-search. */
export async function autocompletePlaces(
  input: string,
  opts: { bias?: LocationBias; sessionToken?: string } = {},
): Promise<PlaceSuggestion[]> {
  if (!input.trim()) return [];
  const data = await placesFetch<{
    suggestions?: Array<{
      placePrediction?: {
        placeId?: string;
        text?: { text?: string };
        structuredFormat?: {
          mainText?: { text?: string };
          secondaryText?: { text?: string };
        };
      };
    }>;
  }>("/places:autocomplete", {
    method: "POST",
    body: {
      input,
      languageCode: "en",
      ...(opts.sessionToken ? { sessionToken: opts.sessionToken } : {}),
      ...(opts.bias ? { locationBias: circle(opts.bias) } : {}),
    },
  });

  return (data.suggestions ?? [])
    .map((s) => s.placePrediction)
    .filter((p): p is NonNullable<typeof p> => Boolean(p?.placeId))
    .map((p) => ({
      placeId: p.placeId!,
      mainText: p.structuredFormat?.mainText?.text ?? p.text?.text ?? "",
      secondaryText: p.structuredFormat?.secondaryText?.text ?? null,
      fullText: p.text?.text ?? p.structuredFormat?.mainText?.text ?? "",
    }));
}
