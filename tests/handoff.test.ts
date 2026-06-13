// §5 Result & handoff (WS-D). URL builder covered in review-generation.test.ts;
// these cover the result screen behaviour + DB side-effects.
import { describe, test } from "bun:test";

describe("Result & handoff", () => {
  test.todo("AC-OUT-1: editable textarea pre-filled; edits update final_text, generated_text preserved");
  test.todo("AC-OUT-2: suggested stars == Q1 rating, advisory copy only");
  test.todo("AC-OUT-3: CTA copies current textarea text + opens writereview?placeid=<resolved id>");
  test.todo("AC-OUT-4: posted flag set true on CTA tap (best-effort funnel)");
  test.todo("AC-OUT-5: clipboard-unsupported fallback message shown, link still available");
  test.todo("AC-OUT-6: refine chips adjust draft within bounds; Reset restores original");
});
