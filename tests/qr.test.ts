// §7 Business QR self-serve (WS-F).
import { describe, test } from "bun:test";

describe("Business QR self-serve", () => {
  test.todo("AC-QR-1: business self-search returns candidates; selection fixes place_id");
  test.todo("AC-QR-2: QR + link both encode /review?placeId=<id> exactly");
  test.todo("AC-QR-3: QR downloadable as PNG (and/or SVG), scans to correct URL");
  test.todo("AC-QR-4: 'Copy link' puts /review?placeId=… on clipboard");
});
