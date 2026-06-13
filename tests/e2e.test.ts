// §1 Happy path smoke (WS-A..D end-to-end). The flows that must never break.
// Implement with Playwright against a running build; mock Places/LLM at the
// service boundary for deterministic PR CI, live nightly.
import { describe, test } from "bun:test";

describe("E2E smoke", () => {
  test.todo(
    "AC-E2E-1: pasted URL → confirm → interview → grounded 40–80w review → suggested stars → copy & open Google → reviews row posted=true",
  );
  test.todo(
    "AC-E2E-2: /review?placeId=… → NO confirmation card → interview → … → posted handoff",
  );
});

describe("Cross-cutting (non-functional)", () => {
  test.todo("AC-NFR-1: no secret leakage to client (see AC-RES-8)");
  test.todo("AC-NFR-2: missing Places category/reviews → 'from scratch' path, no crash");
  test.todo("AC-NFR-3: flows usable at 375px width");
  test.todo("AC-NFR-4: visible copy matches docs/copy.md; never 'AI writes your reviews'");
  test.todo("AC-NFR-5: interview stepper/chips keyboard-navigable; rating labelled");
  test.todo("AC-NFR-6: no code path autoposts to Google on the user's behalf");
  test.todo("AC-NFR-7: no bulk/loop submission endpoint exists");
});
