# Easy Google Reviews — Product Brief & Functional Spec
*Working title. v0.1 — MVP scope.*

## TL;DR
A web app that turns a sub-60-second multiple-choice interview into a well-written, **honest** Google review the user posts themselves. Two ways in: paste a Google Maps URL, or scan a QR a business hands you. The app pulls the business's category and recent reviews, generates a short tailored interview, then writes a review grounded strictly in the user's answers. User edits if they want, taps **Copy & open Google**, pastes into Google's review dialog.

The defensibility thesis: this is *writing assistance, not fabrication*. The review only contains facts the user supplied, its tone matches the rating they gave (including critical), and a human posts it manually. That posture — especially supporting honest negative reviews — is what keeps it on the right side of Google's spam detection instead of in its crosshairs.

**MVP boundary:** Google only; web only; no voice, no photos, no business accounts, no monetization. Architected to extend to Airbnb/ClassPass and voice later.

---

## Positioning & copy
Borrow from Outset and Listen Labs: confident, spare, benefit-led copy; the *interview is the product* (one question at a time, warm, fast, a single strong CTA); clean editorial aesthetic with heavy whitespace. The twist on those references: they interview to *extract* research; we interview to *produce* a gift the user gives a business.

Lead with the human relationship and ease — never "AI writes your reviews."

**Hero candidates**
- *"Leave a review they'll remember — in under a minute."*
- *"Your favorite spot asked for a review. We'll help you write a great one."*

**Subhead**
- *"A 60-second interview becomes an honest, well-written Google review — in your words, grounded in your visit."*

**Framing principle (the through-line for all copy):** reduce decision fatigue, do a good thing, be remembered. The business appreciates it; you get the goodwill (and maybe the discount).

---

## Core user flow (happy path)
*Derived backwards from the end goal — "business remembers you" — then stated forwards.*

1. **Entry.** User arrives via a pasted Maps URL or a business QR/link (`/review?placeId=…`).
2. **Resolve & confirm.** App resolves to a `place_id`, then shows a **confirmation card** (name, address, thumbnail) so a mis-resolution is caught before any work. *(Critical — see resolver risk.)*
3. **Prepare interview.** App fetches business category + up to ~5 reviews, generates (or loads cached) a 4–5 question set tailored to the category.
4. **Interview (<60s).** First question is an overall **1–5 rating**; remaining questions branch on it (highlights vs. what went wrong vs. mixed). Mostly single-select, one multi-select "what stood out," plus one optional free-text "anything else?"
5. **Generate.** Model writes one ~40–80 word review, grounded only in the answers, tone matched to the rating.
6. **Edit & post.** Inline-editable textarea + **Regenerate**. Result screen shows a **suggested star count** (the user's rating). **Copy & open Google** copies the text and deep-links to Google's review dialog, where the user sets stars and pastes.
7. **(Optional) Save.** Logged-in users get the review saved to their history ("your spots").

---

## Functional requirements

### FR-1 — Entry & business resolution
- **FR-1.1** Accept a pasted Google Maps URL: short links (`maps.app.goo.gl/*`, `goo.gl/maps/*`) and long `/maps/place/...@lat,lng...` URLs.
- **FR-1.2** Accept a QR/deep-link route `/review?placeId=<id>` that bypasses resolution entirely.
- **FR-1.3** Resolver pipeline (server-side):
  1. Follow redirects to expand short links.
  2. Parse business name from `/maps/place/<name>/` and coords from `@<lat>,<lng>`.
  3. Resolve via Places **Text Search (New)** using name + coordinate bias → take top candidate's `place_id`.
  4. Confirm by name similarity; if low confidence or only-coords/non-place URL, fall through to a manual search/confirm step.
- **FR-1.4** Always render a **confirmation card** before the interview when entry was a pasted URL. (QR entry may skip, since the `place_id` is authoritative.)
- **FR-1.5** Graceful rejection with a helpful message for URLs that aren't a place (directions, search results lists).

### FR-2 — Interview engine
- **FR-2.1** Fetch business **primary category/type** and up to ~5 reviews from Places API (New).
- **FR-2.2** Generate a short **review summary** from those reviews to nudge question relevance (e.g., recurring themes like wait times, ambiance).
- **FR-2.3** Generate a **4–5 question set** tailored to category. Q1 is always an overall **rating (1–5)**. Example (restaurant): "What did you order?", "Standout dish?", multi-select "What stood out?" (food / service / value / ambiance / speed), optional text.
- **FR-2.4** **Branch on rating:** ≥4 → probe highlights; ≤2 → probe what went wrong; 3 → mixed. Branching may be as simple as swapping the prompt set, not a full decision tree.
- **FR-2.5** Question UI in the style of an AskUserQuestion stepper: one screen per question, visible progress, single/multi-select chips, one optional free-text field. Designed to complete in <60s.
- **FR-2.6** **Cache** the generated question set + category + review summary per `place_id` (TTL ~60 days) so generation runs once per business until stale.

### FR-3 — Review generation
- **FR-3.1** Generate **one** review, default ~40–80 words (2–4 sentences), editable.
- **FR-3.2** **Grounding constraint (hard):** use only facts the user supplied + business name/category. No invented dishes, names, dates, prices, or events. *(The model is a ghostwriter who writes only what you dictated.)*
- **FR-3.3** **Sentiment fidelity:** tone and content match the user's rating; never inflate a negative experience into praise, never soften a rave into faint approval.
- **FR-3.4** **Voice:** generic-natural, human, non-templated — same approach for everyone (no personalization from history in MVP).
- **FR-3.5** Encode a "great review" rubric in the prompt: specific (uses the user's concrete details), honest (matches rating), natural (doesn't read as AI), concise (skimmable), useful to future customers, fair to the business.
- **FR-3.6** **Regenerate** produces a fresh take under the same constraints.

### FR-4 — Result & handoff
- **FR-4.1** Inline-editable textarea pre-filled with the generated text.
- **FR-4.2** **Suggested star count** displayed = the user's Q1 rating (advisory; the user sets actual stars in Google).
- **FR-4.3** **Copy & open Google:** copies `final_text` to clipboard and opens the Google write-review deep link in a new tab: `https://search.google.com/local/writereview?placeid=<PLACE_ID>`. *(The deep link cannot pre-fill text or stars — this is the only viable handoff.)*
- **FR-4.4** Best-effort **posted** flag set when the user taps the CTA (used for funnel analytics; not a confirmed post).

### FR-5 — Accounts & history (optional)
- **FR-5.1** Anonymous users generate freely; **no login required**.
- **FR-5.2** **Clerk** auth. Logging in saves each generation (business + answers + final text) to history.
- **FR-5.3** History view: "your spots" — list of businesses reviewed, with re-access/edit of past text.
- **FR-5.4** *Fast-follow:* claim anonymous generations (via `session_id` in localStorage) on sign-up.

### FR-6 — Business QR self-serve (in MVP)
- **FR-6.1** Public, no-auth page where a business **searches for itself** (Places Autocomplete/Text Search) and selects the right listing.
- **FR-6.2** Generate a **QR code + copyable link** encoding `/review?placeId=<id>`.
- **FR-6.3** Downloadable QR (PNG/SVG) for printing on receipts, table tents, etc.

---

## Integrity model (product strategy, not a disclaimer)
This is the core of the product's right to exist. State it plainly to users where appropriate.

1. **Grounded, not generated-from-nothing.** Only the user's facts appear in the review.
2. **Sentiment is faithful.** Honest negative and mixed reviews are first-class — this is *why* the tool isn't a 5★ farm, and why it survives spam detection.
3. **Human-in-the-loop.** The review is editable and the user posts it manually through a logged-in Google account. No autoposting, ever.
4. **One review per genuine visit.** No bulk/automated submission paths.

These four together convert "AI wrote a review" (a spam signal) into "AI helped a real customer articulate a real experience" (assistance).

---

## Technical architecture
- **Framework:** Next.js (App Router, TypeScript). Server actions / route handlers for all Places + LLM calls (keys never client-side).
- **DB / storage / auth:** Supabase (Postgres + RLS); **Clerk** for auth.
- **Hosting:** Vercel.
- **UI:** Tailwind + shadcn/ui; Framer Motion for the interview stepper transitions (the Outset/Listen Labs polish lives here).
- **LLM:** Anthropic Claude (direct Messages API or Agent SDK). Two prompt jobs: (a) question-set + review-summary generation, (b) review generation/regeneration.
- **Maps:** Google **Places API (New)** — Text Search (resolution), Place Details (category + reviews), Autocomplete (business self-search).
- **QR:** `qrcode` (server) or `qrcode.react` (client).

**Key constraints encoded as design facts**
- Places API returns **max ~5 reviews** — accepted; no scraping, no third-party review API in MVP.
- Write-review deep link **cannot pre-fill** text or rating — handoff is copy-paste by design.
- Pasted-URL resolution is the **flakiest surface**; the confirmation card (FR-1.4) is the mitigation.

### Data model (Supabase, sketch)
```
businesses
  place_id text pk
  name, address, category text
  lat, lng double precision
  review_summary text                  -- AI summary of ≤5 Places reviews
  question_set jsonb                    -- cached generated questions
  questions_generated_at timestamptz
  created_at timestamptz default now()

reviews                                 -- one row per generation
  id uuid pk default gen_random_uuid()
  place_id text references businesses
  user_id text                          -- Clerk id; null = anonymous
  session_id text                       -- anon/local session, for later claim
  rating int                            -- 1–5
  answers jsonb                         -- interview Q/A
  generated_text text
  final_text text                       -- after edits
  posted bool default false             -- best-effort funnel flag
  created_at timestamptz default now()
```
**RLS:** `businesses` readable by all, writable by service role only. `reviews` readable/writable by owner (`user_id = auth.uid()`); anonymous inserts via server route keyed by `session_id`.

**Env:** `ANTHROPIC_API_KEY`, `GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, Clerk keys.

---

## Parallelizable workstreams
Self-contained tracks for concurrent agent/human execution. The seam between B and C is a **JSON contract**, so C builds against a mock while B is in flight.

- **WS-A — Entry & resolution.** URL resolver, QR route, confirmation card. *(Consumes Places via WS-B's service.)*
- **WS-B — AI core (services).** Place details/reviews fetch, review summary, question-set generation, review generation, regenerate, question caching.
- **WS-C — Interview UI.** AskUserQuestion-style stepper, rating gate, branching, free-text, progress. *(Builds against the question contract below.)*
- **WS-D — Result & handoff.** Editable textarea, suggested stars, clipboard, deep-link, posted flag.
- **WS-E — Accounts & history.** Clerk wiring, history list, RLS, claim-on-signup (fast-follow).
- **WS-F — Business QR generator.** Self-serve search → QR + link + download.
- **WS-G — Design shell.** Tailwind/shadcn system, Framer transitions, landing + copy.

**The B↔C contract (question set):**
```json
{
  "businessName": "string",
  "category": "string",
  "questions": [
    { "id": "q1", "prompt": "Overall, how was it?", "type": "rating" },
    { "id": "q2", "prompt": "What did you order?", "type": "single",
      "options": [{ "id": "a", "label": "..." }] },
    { "id": "q3", "prompt": "What stood out?", "type": "multi",
      "options": [{ "id": "food", "label": "Food" }] },
    { "id": "q4", "prompt": "Anything else?", "type": "text", "optional": true }
  ]
}
```
`questions[0].type` is always `"rating"`. Generation (B) emits this; UI (C) renders it.

---

## Out of scope (MVP)
Voice / STT; photo upload; multi-platform (Airbnb, ClassPass, etc.); business accounts/dashboards/analytics for businesses; monetization; i18n beyond English-first; loyalty / "brownie points" as a built feature (it's positioning copy); confirmed post-verification (we can't read back what the user actually posted).

## Open risks & sharp edges
- **Pasted-URL resolution** is inherently lossy (hex feature IDs ≠ `place_id`, coords-only URLs, renamed places). Confidence: this *will* be the top bug source. Mitigation: confirmation card + manual search fallback. QR entry has none of this.
- **Platform dependency / Google policy.** AI-assisted and incentivized reviews are policy-sensitive territory; the grounding + human-post model is the mitigation, but Google could change deep-link behavior or tighten detection at any time. This is a real strategic risk, not a disclaimer.
- **Deep-link friction.** Copy-then-paste is two steps and feels less magical than "post for me." It's the only honest option; lean into "you stay in control."
- **5-review ceiling** makes the review-summary nudge thin for some businesses. Accepted for MVP.

## Obvious next extensions
Voice interview (ElevenLabs STT) — the natural successor to the multiple-choice flow. Multi-platform handoffs (Airbnb, ClassPass, Yelp). Business side: lightweight dashboard, QR analytics, "regulars" recognition. Personalized voice from saved history (the payoff for accounts).
