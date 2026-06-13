// §2 Entry & business resolution (WS-A). Wire to the resolver service + browser.
// Recommendation: unit-test the URL parser against fixtures.urls with Places mocked
// at the service boundary; use Playwright for the confirmation-card / fallback UI.
import { describe, test } from "bun:test";

describe("Entry & resolution", () => {
  test.todo("AC-RES-1: short link is redirect-expanded before parsing");
  test.todo("AC-RES-2: long URL → name + coords parsed, Text Search with coord bias, top place_id");
  test.todo("AC-RES-3: confirmation card always shown for pasted URLs before interview");
  test.todo("AC-RES-4: low-confidence (renamed) → candidate picker, not auto-proceed");
  test.todo("AC-RES-5: coords-only URL → manual search/confirm step");
  test.todo("AC-RES-6: directions/search-list URL → friendly 'not a business' + Search by name");
  test.todo("AC-RES-7: 'Search again' returns to entry without losing session");
  test.todo("AC-RES-8: GOOGLE_MAPS_API_KEY / ANTHROPIC_API_KEY absent from client bundle & requests");
});
