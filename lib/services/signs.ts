import "server-only";
import { generateImage } from "@/lib/fal";

/**
 * Generate a counter-sign *concept preview* for a business — a cute tabletop
 * review sign the owner can imagine on their register. The QR shown is a
 * decorative placeholder (the real, scannable QR lives elsewhere on /for-business),
 * so this is purely a design mockup. Returns a PNG data URL ready to render and
 * download, matching the contract of `generateQrAction`'s `png` field.
 */

function buildPrompt(businessName: string): string {
  return [
    `A cute, modern tabletop "review us" sign for a small business named "${businessName}",`,
    "displayed on a clean white acrylic stand on a shop counter, photographed at a slight angle with a softly blurred cafe background.",
    `The sign clearly shows the business name "${businessName}" as a friendly heading,`,
    'the line "Leave us an EasyReview" beneath it,',
    "and a decorative QR code in the lower portion (a generic placeholder QR pattern, not a real scannable code).",
    "Warm editorial garden aesthetic: cream paper, deep forest-green ink, soft sage-green accents, a tasteful botanical leaf motif, generous whitespace.",
    "Charming, inviting, premium small-business feel. Crisp legible lettering. Do not add any other text, logos, prices, or watermarks.",
  ].join(" ");
}

/** Normalize a fal image URL to a self-contained PNG data URL. Exported for tests. */
export async function toPngDataUrl(url: string): Promise<string> {
  // sync_mode returns an inline data URI — pass it straight through.
  if (url.startsWith("data:")) return url;

  // Otherwise fal returned a hosted URL; fetch and inline it so the client
  // never needs remote-image config and the download stays self-contained.
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch generated sign image (${res.status}).`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  return `data:image/png;base64,${buf.toString("base64")}`;
}

export async function generateSign(opts: {
  businessName: string;
}): Promise<{ png: string }> {
  const result = await generateImage({ prompt: buildPrompt(opts.businessName) });
  const first = result.images?.[0]?.url;
  if (!first) throw new Error("fal returned no image.");
  return { png: await toPngDataUrl(first) };
}
