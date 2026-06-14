/**
 * Smoke test: generate a real counter-sign concept via fal.ai and write it to
 * disk so we can eyeball the result. Run: bun run smoke:sign
 */
import { writeFileSync } from "node:fs";
import { generateSign } from "@/lib/services/signs";

const name = process.argv[2] ?? "Blue Bottle Coffee";
console.log(`Generating sign concept for "${name}"…`);

const t0 = performance.now();
const { png } = await generateSign({ businessName: name });
const secs = ((performance.now() - t0) / 1000).toFixed(1);

const base64 = png.replace(/^data:image\/png;base64,/, "");
const out = "scripts/sign-out.png";
writeFileSync(out, Buffer.from(base64, "base64"));
console.log(`✓ ${secs}s — ${(base64.length / 1024).toFixed(0)}KB → ${out}`);
