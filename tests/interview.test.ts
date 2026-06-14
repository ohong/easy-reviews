// §3 Interview engine UI (WS-C). Branch logic + contract are covered in
// contract.test.ts; these cover the rendered stepper behaviour (Playwright).
import { describe, test } from "bun:test";

describe("Interview engine (UI)", () => {
  test.todo("AC-INT-2: branch header matches rating (≥4 highlights / 3 mixed / ≤2 problems)", () => {});
  test.todo("AC-INT-3: one question per screen, 'Question N of M' progress, Back preserves answers", () => {});
  test.todo("AC-INT-4: multi-select never submits more than its cap (Pick up to 3)", () => {});
  test.todo("AC-INT-5: optional free-text is skippable; interview still completes", () => {});
  test.todo("AC-INT-6: empty submit blocked with 'Add at least a rating…'", () => {});
  test.todo("AC-INT-7: question set cached per place_id (no 2nd generation within TTL; stale regenerates)", () => {});
  test.todo("AC-INT-8: recurring review theme surfaces in themes/questions; no-reviews place still valid", () => {});
  test.todo("AC-INT-9: P50 interview completion < 60s (first render → generate tap)", () => {});
});
