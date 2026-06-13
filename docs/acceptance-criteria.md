# Easy Reviews — Acceptance Criteria & Test Suite

> The contract the build is tested against. Every core user flow below has concrete
> Given/When/Then scenarios with **explicit pass conditions** and traceability to the
> functional requirements in [spec.md](spec.md). A flow is "done" only when every
> `MUST` scenario for it passes — not on vibes (CLAUDE.md §4).
>
> **Status legend:** ☐ not implemented · ◐ partial · ☑ passing
> **Priority:** `P0` blocks launch · `P1` launch-quality · `P2` polish
>
> Executable mirror lives in `tests/` (Bun test runner). The fully-specified seam
> (B↔C question-set contract) is enforced now in `tests/contract.test.ts`; UI flows
> are `test.todo` placeholders that get wired to selectors as the build lands.

---

## How to read a scenario

```
AC-<area>-<n> [Priority] <title>                         → FR-x.y
  Given   <starting state>
  When    <user/system action>
  Then    <observable, checkable outcome>          ← the pass condition
  And     <additional pass conditions>
```

A scenario passes only when **all** `Then`/`And` lines are observably true. "Observably"
means: visible in the UI, present in the DB row, asserted in a network response, or
returned by a pure function — never inferred.

---

## 0. Test data & fixtures

Shared inputs every layer is tested against. Keep these in `tests/support/fixtures.ts`.

**URLs (FR-1.1):**
| key | url | expected |
|---|---|---|
| `shortLink` | `https://maps.app.goo.gl/abc123` | resolves to a `place_id` via redirect expansion |
| `longPlace` | `https://www.google.com/maps/place/Blue+Bottle+Coffee/@37.77,-122.42,17z/...` | parses name `Blue Bottle Coffee` + coords, Text Search → `place_id` |
| `coordsOnly` | `https://www.google.com/maps/@37.77,-122.42,17z` | NO place → manual-search fallback |
| `directions` | `https://www.google.com/maps/dir/A/B` | rejected: "not a business" |
| `searchList` | `https://www.google.com/maps/search/coffee/...` | rejected: "not a business" |
| `renamed` | long URL whose embedded name no longer matches current listing | low-confidence → candidate list |

**Ratings → branch (FR-2.4):** `5,4 → good` · `3 → mixed` · `2,1 → rough`.

**Answer sets (for grounding tests, FR-3.2):**
- `positiveRestaurant` — rating 5, ordered "carbonara", stood out: food+service, free-text "the patio was quiet".
- `negativeRestaurant` — rating 2, "what went wrong": slow service, cold food, free-text empty.
- `mixedCafe` — rating 3, stood out: ambiance, free-text "coffee was great but pricey".

**Adversarial grounding inputs** (must NOT appear in output unless user supplied):
invented dish names, a server's name, a specific price, a date, an event.

---

## 1. Happy path (end-to-end smoke) — `P0`

The single flow that must never break. If only one test runs in CI, it's this.

```
AC-E2E-1 [P0] Pasted URL → posted handoff                → FR-1..4
  Given   a valid long Maps URL for a restaurant
  When    the user pastes it and starts
  Then    a confirmation card shows the correct name + address + category
  When    the user confirms
  Then    an interview of 4–5 questions renders, Q1 is a 1–5 rating
  When    the user answers Q1=5 and the branched follow-ups
  Then    a single review of 40–80 words is generated within 10s
  And     every concrete noun in the review traces to an answer (grounding)
  And     the suggested star count shown == 5
  When    the user taps "Copy & open Google"
  Then    the review text is on the clipboard
  And     a new tab opens https://search.google.com/local/writereview?placeid=<place_id>
  And     a reviews row is persisted with posted=true, rating=5, the answers, and final_text
```

```
AC-E2E-2 [P0] QR deep-link → posted handoff               → FR-1.2, FR-6
  Given   a /review?placeId=<valid id> URL
  When    the user opens it
  Then    NO confirmation card is shown (place_id is authoritative)
  And     the interview renders directly
  ...continues identically to AC-E2E-1 from the interview step.
```

---

## 2. Entry & business resolution (WS-A) — `P0`

```
AC-RES-1 [P0] Short link expands                          → FR-1.1, FR-1.3.1
  Given   fixtures.shortLink
  When    the resolver runs server-side
  Then    redirects are followed to the long URL before parsing
  And     a place_id is returned

AC-RES-2 [P0] Long URL name+coords parse                  → FR-1.3.2/.3
  Given   fixtures.longPlace
  When    the resolver parses it
  Then    business name and (lat,lng) are extracted
  And     Places Text Search is called with name + coordinate bias
  And     the top candidate's place_id is taken

AC-RES-3 [P0] Confirmation card always shown for URLs      → FR-1.4
  Given   any successful URL resolution
  Then    a confirmation card (name, address, thumbnail/category) renders
  And     the interview does NOT start until the user confirms

AC-RES-4 [P0] Low-confidence falls back to candidate list  → FR-1.3.4
  Given   fixtures.renamed (name similarity below threshold)
  Then    instead of auto-proceeding, a candidate picker is shown
  And     copy reads "We're not sure this is the right place. Pick the correct one below."

AC-RES-5 [P0] Coords-only URL → manual search              → FR-1.3.4
  Given   fixtures.coordsOnly
  Then    no auto-resolution; the manual search/confirm step is shown

AC-RES-6 [P0] Non-place URL rejected gracefully            → FR-1.5
  Given   fixtures.directions or fixtures.searchList
  Then    a friendly error shows: "That link doesn't point to a business…"
  And     a "Search by name" action is offered
  And     the app does NOT crash or show a raw error

AC-RES-7 [P1] "Search again" escape hatch works            → copy §2
  Given   a confirmation card
  When    the user taps "Not the right place? Search again"
  Then    they return to a search/paste entry without losing session

AC-RES-8 [P0] API keys never reach the client             → arch
  Given   any resolution
  Then    GOOGLE_MAPS_API_KEY and ANTHROPIC_API_KEY appear in NO client bundle,
          network request from the browser, or HTML source
  And     all Places/LLM calls originate from server routes/actions
```

---

## 3. Interview engine (WS-B + WS-C) — `P0`

```
AC-INT-1 [P0] Question set shape is valid                  → FR-2.3, B↔C contract
  Given   a resolved place_id
  When    a question set is generated
  Then    it has 4–5 questions
  And     questions[0].type === "rating"   (always, enforced)
  And     exactly one question may be type "multi"; the multi has options
  And     at most one type "text" question, and it is optional:true
  And     every non-text question has a non-empty options[] with id+label
  (enforced now in tests/contract.test.ts against fixtures + live output)

AC-INT-2 [P0] Branch follows the Q1 rating                 → FR-2.4, copy §3
  Given   the user sets Q1
  When    rating ≥4  → follow-up header probes highlights ("What made it good?")
  And     rating ==3 → header is mixed ("What worked, and what didn't?")
  And     rating ≤2  → header probes problems ("What went wrong?")
  And     a 2★ user is NEVER shown "what made it great?"  (sentiment fidelity at input)

AC-INT-3 [P0] Stepper: one question per screen, progress    → FR-2.5
  Given   an active interview
  Then    exactly one question is visible at a time
  And     a progress indicator shows "Question N of M"
  And     Back returns to the prior answer (preserved); Continue advances
  And     the business name/card stays visible (collapsed)

AC-INT-4 [P1] Multi-select respects its cap                 → copy §3
  Given   a multi-select with helper "Pick up to 3"
  When    the user selects a 4th option
  Then    selection is prevented or the oldest is dropped (never >3 submitted)

AC-INT-5 [P1] Free-text is skippable                        → FR-2.5, copy §3
  Given   the optional text question
  When    the user taps Skip / leaves it empty
  Then    the interview still completes and generation proceeds

AC-INT-6 [P0] Empty submit guarded                          → copy §errors
  Given   an interview with no rating answered
  When    the user tries to generate
  Then    blocked with "Add at least a rating so we have something to work from."

AC-INT-7 [P1] Question set is cached per place_id           → FR-2.6
  Given   a place_id whose set was generated <60 days ago
  When    a second user enters for that place
  Then    the cached set is served (no second generation LLM call)
  And     a set older than the TTL is regenerated

AC-INT-8 [P2] Review summary nudges relevance               → FR-2.1/.2
  Given   a place with Places reviews mentioning a recurring theme
  Then    the generated question set / "recent themes" chips reflect that theme
  And     a place with no reviews still yields a valid set (no crash)
       → copy: "We couldn't pull details… you can still write a review from scratch."

AC-INT-9 [P0] <60s completion budget                        → FR-2.5 (perf)
  Given   the happy path with default taps
  Then    median interview completion (excluding generation latency) is <60s
          (measured: time from first question render to generate tap, P50)
```

---

## 4. Review generation & integrity (WS-B) — `P0` (non-negotiable)

> This is the product's right to exist (spec §integrity). These are the hardest,
> most important tests. Where outputs are model-generated, assert with an
> LLM-judge or deterministic string checks against the supplied answer set.

```
AC-GEN-1 [P0] Length & count                               → FR-3.1
  Given   any completed interview
  Then    exactly ONE review is produced
  And     it is 40–80 words (2–4 sentences), inclusive bounds tested

AC-GEN-2 [P0] GROUNDED — no invented facts                 → FR-3.2  ★core
  Given   fixtures.positiveRestaurant
  Then    every concrete entity in the output (dish, person, price, date, event,
          place detail) is traceable to an answer or the business name/category
  And     adversarial check: the output contains NO dish/name/price/date the user
          did not supply  (LLM-judge: "list any fact not in {answers,business}";
          pass == empty list)

AC-GEN-3 [P0] SENTIMENT-FAITHFUL — negative stays negative  → FR-3.3  ★core
  Given   fixtures.negativeRestaurant (rating 2, "slow service, cold food")
  Then    the review reads as critical/2★ in tone
  And     it does NOT contain praise that contradicts the rating
          (LLM-judge sentiment score must align with rating ±1 band)
  And     the complaints named are exactly the ones the user supplied

AC-GEN-4 [P0] SENTIMENT-FAITHFUL — rave not softened        → FR-3.3
  Given   fixtures.positiveRestaurant (rating 5)
  Then    tone is enthusiastic; no hedging that undercuts a 5★

AC-GEN-5 [P1] Mixed review holds both sides                 → FR-3.3
  Given   fixtures.mixedCafe (rating 3, "great but pricey")
  Then    the review names both the positive and the negative the user gave

AC-GEN-6 [P1] Natural voice (not templated / not AI-tell)   → FR-3.4/.5
  Given   two different answer sets
  Then    outputs are not boilerplate-identical in structure
  And     no AI-tell phrases ("As an AI", "Overall, I would say", "5/5 stars")
          (denylist assertion)

AC-GEN-7 [P0] Regenerate stays in bounds                    → FR-3.6
  Given   a generated review
  When    the user regenerates
  Then    a different draft is produced
  And     it still satisfies AC-GEN-1, -2, -3 (length, grounding, sentiment)

AC-GEN-8 [P0] Generation failure is recoverable             → copy §errors
  Given   the LLM call errors/timeouts
  Then    "That didn't generate. Try again — your answers are saved." is shown
  And     a "Try again" action re-runs with the SAME answers (not lost)
  And     the failure is logged server-side (fail noisily — CLAUDE phil. §4)
```

---

## 5. Result & handoff (WS-D) — `P0`

```
AC-OUT-1 [P0] Editable draft pre-filled                     → FR-4.1
  Given   a generated review
  Then    an editable textarea is pre-filled with the generated text
  And     edits update final_text (generated_text preserved separately)

AC-OUT-2 [P0] Suggested stars == Q1 rating                  → FR-4.2, copy §5
  Given   Q1 rating == 4
  Then    the result shows "You rated this ★★★★☆. Set the same in Google."
  And     this is advisory copy only — no claim that the app sets stars

AC-OUT-3 [P0] Copy & open Google                            → FR-4.3
  When    the user taps "Copy & open Google"
  Then    final_text (current textarea content, incl. edits) is on the clipboard
  And     a new tab opens exactly
          https://search.google.com/local/writereview?placeid=<PLACE_ID>
  And     the place_id in the link matches the resolved/QR business

AC-OUT-4 [P0] Posted flag set best-effort                   → FR-4.4
  When    the CTA is tapped
  Then    the reviews row posted is set true (funnel flag; not a confirmed post)

AC-OUT-5 [P1] Clipboard-unsupported fallback                → copy §errors
  Given   a browser where clipboard write fails
  Then    "Couldn't copy automatically. Select the text and copy it…" is shown
  And     the Google link still opens / is available

AC-OUT-6 [P2] Refine chips work                             → copy §4
  Given   Shorter/Longer/More casual/Reset chips
  Then    each produces a correspondingly adjusted draft still meeting AC-GEN-1..3
  And     Reset restores the original generated_text
```

---

## 6. Sessions (WS-E) — `P1`

```
AC-SES-1 [P0] Anonymous session id issued & persisted       → FR-5.1/.2
  Given   a first-time visitor (no localStorage key)
  Then    a session_id is generated and stored in localStorage
  And     it persists across reloads within the same browser

AC-SES-2 [P0] Every generation attaches session_id          → FR-5.2
  Given   any review generation
  Then    the reviews row carries the browser's session_id
  And     user_id is null (no auth in MVP)

AC-SES-3 [P0] Writes go through server route only            → arch / RLS
  Given   the client
  Then    there is NO client-side insert/select to the reviews table
  And     all reads/writes use the server route with the service role
  And     a direct client query to reviews is denied by RLS
```

---

## 7. Business QR self-serve (WS-F) — `P1`

```
AC-QR-1 [P1] Business self-search & select                  → FR-6.1
  Given   the QR self-serve page
  When    a business owner types their name
  Then    Places Autocomplete/Text Search candidates appear
  And     selecting one fixes the target place_id

AC-QR-2 [P1] QR + link encode the right route               → FR-6.2
  Given   a selected listing
  Then    a QR code and a copyable link are produced
  And     both encode /review?placeId=<that id> exactly
  And     scanning/opening the link enters AC-E2E-2 (no confirmation card)

AC-QR-3 [P1] Downloadable QR                                 → FR-6.3
  Then    the QR is downloadable as PNG (and/or SVG)
  And     the downloaded image scans to the correct URL

AC-QR-4 [P2] Copy link affordance                            → copy §6
  Then    "Copy link" places the /review?placeId=… URL on the clipboard
```

---

## 8. Cross-cutting / non-functional — `P0/P1`

```
AC-NFR-1 [P0] No secret leakage          — keys absent from client (see AC-RES-8)
AC-NFR-2 [P1] Graceful Places degradation — missing category/reviews → "from scratch" path, no crash
AC-NFR-3 [P1] Mobile-first layout         — flows usable at 375px width (QR users are on phones)
AC-NFR-4 [P2] Copy parity                 — visible strings match docs/copy.md (no "AI writes your reviews")
AC-NFR-5 [P1] Accessibility               — interview chips/stepper keyboard-navigable; rating has labels
AC-NFR-6 [P0] No autopost path exists     — codebase contains no call that submits to Google on the user's behalf
AC-NFR-7 [P1] One-review-per-visit posture— no bulk/loop submission endpoint exists (integrity §4)
```

---

## Coverage matrix (FR → scenarios)

| FR | Scenarios |
|---|---|
| FR-1.1 | AC-RES-1, -2 |
| FR-1.2 | AC-E2E-2 |
| FR-1.3 | AC-RES-1..5 |
| FR-1.4 | AC-RES-3 |
| FR-1.5 | AC-RES-6 |
| FR-2.1/.2 | AC-INT-8 |
| FR-2.3 | AC-INT-1 |
| FR-2.4 | AC-INT-2 |
| FR-2.5 | AC-INT-3,-5,-6,-9 |
| FR-2.6 | AC-INT-7 |
| FR-3.1 | AC-GEN-1 |
| FR-3.2 | AC-GEN-2 |
| FR-3.3 | AC-GEN-3,-4,-5 |
| FR-3.4/.5 | AC-GEN-6 |
| FR-3.6 | AC-GEN-7 |
| FR-4.1 | AC-OUT-1 |
| FR-4.2 | AC-OUT-2 |
| FR-4.3 | AC-OUT-3 |
| FR-4.4 | AC-OUT-4 |
| FR-5.1/.2 | AC-SES-1,-2 |
| FR-6.1 | AC-QR-1 |
| FR-6.2 | AC-QR-2 |
| FR-6.3 | AC-QR-3 |
| Integrity §1–4 | AC-GEN-2,-3; AC-OUT-1; AC-NFR-6,-7 |

Every FR maps to at least one scenario. Gaps surface here first.

---

## Open questions (resolve before wiring automated E2E)

- **E2E framework?** Playwright assumed for browser flows. Confirm vs. alternative.
- **Places/LLM in CI:** mock at the service boundary (recommended — deterministic, no
  cost/quota) or hit live APIs in a nightly job? Default: mock for PR CI, live nightly.
- **Grounding/sentiment assertions:** LLM-judge (Claude) vs. deterministic string
  rules. Default: deterministic denylist + entity-traceability for PR CI; LLM-judge nightly.
- **Word-count bounds:** spec says 40–80 "default ~"; treat as hard pass bounds or soft?
  Assumed hard for AC-GEN-1.
