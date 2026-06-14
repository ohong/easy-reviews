/**
 * Reusable graphic generator — fal.ai nano-banana-2.
 *
 * Bun auto-loads .env.local, so FAL_KEY is on process.env; the @fal-ai/client
 * reads it automatically. Keep this server-side only (it uses the secret key).
 *
 * Usage:
 *   bun run scripts/gen-image.ts <outPath> <aspect_ratio> <resolution> "<prompt>"
 * Example:
 *   bun run scripts/gen-image.ts app/opengraph-image.png 16:9 2K "..."
 *
 * Why a script and not inline: generation is a policy (which assets, which
 * prompts) layered on a stable mechanism (call fal, download to disk). Swapping
 * the model or prompt is a one-line change here — never touches app code.
 */
import { fal } from "@fal-ai/client";

const [outPath, aspect = "16:9", resolution = "2K", prompt] = process.argv.slice(2);

if (!process.env.FAL_KEY) {
  console.error("FAL_KEY missing — add it to .env.local");
  process.exit(1);
}
if (!outPath || !prompt) {
  console.error('Usage: bun run scripts/gen-image.ts <outPath> <aspect> <resolution> "<prompt>"');
  process.exit(1);
}

console.error(`Generating ${outPath}  (${aspect}, ${resolution})…`);

const result = await fal.subscribe("fal-ai/nano-banana-2", {
  input: {
    prompt,
    num_images: 1,
    aspect_ratio: aspect as never,
    output_format: "png",
    resolution: resolution as never,
  },
  logs: false,
});

const url = result.data?.images?.[0]?.url;
if (!url) {
  console.error("No image returned:", JSON.stringify(result.data, null, 2));
  process.exit(1);
}

const res = await fetch(url);
if (!res.ok) {
  console.error(`Download failed: ${res.status} ${res.statusText}`);
  process.exit(1);
}
await Bun.write(outPath, await res.arrayBuffer());

const { width, height } = result.data.images[0];
console.error(`✓ wrote ${outPath}  ${width}×${height}`);
