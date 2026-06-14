import "server-only";
import { requireFalKey } from "@/lib/env";

/**
 * Thin server-side client for fal.ai's synchronous run endpoint.
 * Mirrors the shape of `placesFetch` in lib/places.ts: a typed error class,
 * `cache: "no-store"`, and a truncated error body so failures are loud and
 * localisable. No SDK dependency — raw `fetch` keeps the bundle lean.
 */

const HOST = "https://fal.run";

export class FalError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "FalError";
  }
}

export interface FalImage {
  url: string;
  content_type?: string;
  file_name?: string;
  width?: number;
  height?: number;
}

export interface FalImageResult {
  images: FalImage[];
  description?: string;
}

/**
 * Generate an image with nano-banana-2 (Google's text-to-image model on fal).
 * `sync_mode: true` makes fal inline the result as a data URI in `images[].url`
 * rather than a hosted URL, so callers get a self-contained image back.
 */
export async function generateImage(opts: {
  prompt: string;
  aspectRatio?: string;
  resolution?: "0.5K" | "1K" | "2K" | "4K";
}): Promise<FalImageResult> {
  const key = requireFalKey();

  const res = await fetch(`${HOST}/fal-ai/nano-banana-2`, {
    method: "POST",
    headers: {
      Authorization: `Key ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: opts.prompt,
      num_images: 1,
      output_format: "png",
      aspect_ratio: opts.aspectRatio ?? "3:4",
      resolution: opts.resolution ?? "2K",
      sync_mode: true,
    }),
    // Generations are request-specific; never cache at the fetch layer.
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new FalError(
      `fal nano-banana-2 failed (${res.status}): ${detail.slice(0, 300)}`,
      res.status,
    );
  }

  return (await res.json()) as FalImageResult;
}
