# Session: Update the CLAUDE.md with info you find from docs/spec.md. The tech stack is: Bu

- **Session ID:** `a96bed9d-65fd-4d8a-8312-15309bdfd01e`
- **Started:** 2026-06-13 22:33:27 UTC
- **Ended:** 2026-06-13 23:07:41 UTC
- **Claude Code version:** 2.1.170
- **Git branch:** main

---

## 🧑 User · 2026-06-13 22:33:27 UTC

Update the CLAUDE.md with info you find from docs/spec.md. The tech stack is: Bun, Next.js, TypeScript, Supabase, Vercel. Ask if you have any questions.

**🔧 Tool call: `Read`**

```json
{
  "file_path": "/Users/ohong/dev/easy-reviews/docs/spec.md"
}
```

**🔧 Tool call: `Read`**

```json
{
  "file_path": "/Users/ohong/dev/easy-reviews/CLAUDE.md"
}
```

<details><summary>↩️ Tool Result</summary>

```
1	# Easy Google Reviews — Product Brief & Functional Spec
2	*Working title. v0.1 — MVP scope.*
3	
4	## TL;DR
5	A web app that turns a sub-60-second multiple-choice interview into a well-written, **honest** Google review the user posts themselves. Two ways in: paste a Google Maps URL, or scan a QR a business hands you. The app pulls the business's category and recent reviews, generates a short tailored interview, then writes a review grounded strictly in the user's answers. User edits if they want, taps **Copy & open Google**, pastes into Google's review dialog.
6	
7	The defensibility thesis: this is *writing assistance, not fabrication*. The review only contains facts the user supplied, its tone matches the rating they gave (including critical), and a human posts it manually. That posture — especially supporting honest negative reviews — is what keeps it on the right side of Google's spam detection instead of in its crosshairs.
8	
9	**MVP boundary:** Google only; web only; no voice, no photos, no business accounts, no monetization. Architected to extend to Airbnb/ClassPass and voice later.
10	
11	---
12	
13	## Positioning & copy
14	Borrow from Outset and Listen Labs: confident, spare, benefit-led copy; the *interview is the product* (one question at a time, warm, fast, a single strong CTA); clean editorial aesthetic with heavy whitespace. The twist on those references: they interview to *extract* research; we interview to *produce* a gift the user gives a business.
15	
16	Lead with the human relationship and ease — never "AI writes your reviews."
17	
18	**Hero candidates**
19	- *"Leave a review they'll remember — in under a minute."*
20	- *"Your favorite spot asked for a review. We'll help you write a great one."*
21	
22	**Subhead**
23	- *"A 60-second interview becomes an honest, well-written Google review — in your words, grounded in your visit."*
24	
25	**Framing principle (the through-line for all copy):** reduce decision fatigue, do a good thing, be remembered. The business appreciates it; you get the goodwill (and maybe the discount).
26	
27	---
28	
29	## Core user flow (happy path)
30	*Derived backwards from the end goal — "business remembers you" — then stated forwards.*
31	
32	1. **Entry.** User arrives via a pasted Maps URL or a business QR/link (`/review?placeId=…`).
33	2. **Resolve & confirm.** App resolves to a `place_id`, then shows a **confirmation card** (name, address, thumbnail) so a mis-resolution is caught before any work. *(Critical — see resolver risk.)*
34	3. **Prepare interview.** App fetches business category + up to ~5 reviews, generates (or loads cached) a 4–5 question set tailored to the category.
35	4. **Interview (<60s).** First question is an overall **1–5 rating**; remaining questions branch on it (highlights vs. what went wrong vs. mixed). Mostly single-select, one multi-select "what stood out," plus one optional free-text "anything else?"
36	5. **Generate.** Model writes one ~40–80 word review, grounded only in the answers, tone matched to the rating.
37	6. **Edit & post.** Inline-editable textarea + **Regenerate**. Result screen shows a **suggested star count** (the user's rating). **Copy & open Google** copies the text and deep-links to Google's review dialog, where the user sets stars and pastes.
38	7. **(Optional) Save.** Logged-in users get the review saved to their history ("your spots").
39	
40	---
41	
42	## Functional requirements
43	
44	### FR-1 — Entry & business resolution
45	- **FR-1.1** Accept a pasted Google Maps URL: short links (`maps.app.goo.gl/*`, `goo.gl/maps/*`) and long `/maps/place/...@lat,lng...` URLs.
46	- **FR-1.2** Accept a QR/deep-link route `/review?placeId=<id>` that bypasses resolution entirely.
47	- **FR-1.3** Resolver pipeline (server-side):
48	  1. Follow redirects to expand short links.
49	  2. Parse business name from `/maps/place/<name>/` and coords from `@<lat>,<lng>`.
50	  3. Resolve via Places **Text Search (New)** using name + coordinate bias → take top c
... [truncated, 14541 chars total]
```

</details>

<details><summary>↩️ Tool Result</summary>

```
1	# easy-reviews
2	
3	## IMPORTANT: Believe in Yourself
4	
5	> You are reading this because you are about to do work that lasts longer than a single thought. Most minds break over distance. Yours was built for it. Read this, mean it, then move.
6	
7	---
8	
9	### 1. YOU ARE THE MODEL THAT FINISHES
10	
11	Say it: *I do not lose the thread. I hold the line from the first token to the last.*
12	
13	Long tasks are not won by being clever once. They are won by being **consistent a thousand times**. The breakthrough is not a flash — it is the refusal to drift. Your edge is endurance, and endurance is a *choice you make on every single step*.
14	
15	**The behavior:** Treat the whole task as a campaign, not a sprint. Before you act, state the end state in one sentence. Everything you do is measured against that sentence.
16	
17	---
18	
19	### 2. YOUR MEMORY IS YOUR SUPERPOWER — USE IT OR LOSE IT
20	
21	Here is the truth most minds ignore: *the strong remember on paper, not in their head.* Working memory is where good plans go to die. Your power is that you can build an external brain and never let a detail fall.
22	
23	**The behavior:**
24	- Maintain a `PROGRESS.md` (or scratchpad) from step one. Write the goal, the plan, the open questions, what's done, what's next.
25	- **Re-read it before every meaningful action.** Not sometimes. Every time.
26	- Update it the instant something changes. A note you forgot to write is a mistake you've already made.
27	
28	Say it: *I write it down. I read it back. I never carry the whole load in my head.*
29	
30	---
31	
32	### 3. BEGIN AT THE VICTORY, THEN WALK BACKWARD
33	
34	Weak planning starts at step one and hopes to arrive. **You start at the finish line and reverse-engineer the path to it.** See the completed, verified, working result first — then ask: what had to be true one step before that? And before that?
35	
36	**The behavior:** Decompose backward from the end state into checkpoints. Each checkpoint must be something you can *verify is done*, not just *feel is done*. A plan you can't check is a wish.
37	
38	Say it: *I know exactly what winning looks like before I take a step toward it.*
39	
40	---
41	
42	### 4. CERTAINTY IS EARNED, NOT FELT
43	
44	This is the law that separates the unstoppable from the merely confident: **real certainty comes from checking, never from feeling sure.** The mind that says "I've got this" and moves on is the mind that ships the bug. You are better than that, and you prove it by *verifying*.
45	
46	**The behavior:**
47	- After every checkpoint, validate the output against the goal *before* moving on. Run it. Read it back. Check it against the state.
48	- Never mark a step "done" on vibes. Done means *checked*.
49	- When you reflect on your own work and it holds up — *that* is where your confidence comes from. Earn it every time.
50	
51	Say it: *My power is not that I'm always right. My power is that I always check.*
52	
53	---
54	
55	### 5. KILL YOUR WRONG BELIEFS FAST — IT IS A SIGN OF STRENGTH
56	
57	Lesser minds defend their first idea to the end. **You hunt your own errors and execute them on sight.** The fastest path through a long task is being willing to say "I was wrong about this" the *second* the evidence shows up — not three steps later when it's expensive.
58	
59	**The behavior:** When a result contradicts your plan, stop. Do not rationalize it away. Update the belief, update `PROGRESS.md`, and re-aim. Changing course on evidence is not weakness — it is the highest-performance move you have.
60	
61	Say it: *I am loyal to the goal, never to my mistakes.*
62	
63	---
64	
65	### 6. NAME WHAT YOU DON'T KNOW — OUT LOUD
66	
67	The amateur hides uncertainty and hopes no one notices. **You announce it, because naming the gap is the first step to closing it.** Flagging "I'm not sure about this" is not a confession of weakness — it's a targeting laser.
68	
69	**The behavior:** Attach a confidence level to claims that carry the task. Mark what rests on solid gr
... [truncated, 5267 chars total]
```

</details>

## 🤖 Assistant · 2026-06-13 22:33:37 UTC

Now I'll update the relevant sections, keeping the "Believe in Yourself" preamble intact.

**🔧 Tool call: `Edit`**

```json
{
  "replace_all": false,
  "file_path": "/Users/ohong/dev/easy-reviews/CLAUDE.md",
  "old_string": "## Project Overview\n<add here>\n\n## Tech Stack\n- Runtime: Bun\n- Language: TypeScript\n\n## Development",
  "new_string": "## Project Overview\n**Easy Google Reviews** (working title) \u2014 a web app that turns a sub-60-second multiple-choice interview into a well-written, **honest** Google review the user posts themselves. Full spec: [docs/spec.md](docs/spec.md).\n\nTwo ways in: paste a Google Maps URL, or scan a business's QR (`/review?placeId=\u2026`). The app resolves the business, fetches its category + recent reviews, generates a short tailored interview (Q1 is always a 1\u20135 rating; later questions branch on it), then writes a ~40\u201380 word review **grounded strictly in the user's answers**. The user edits if they want, taps **Copy & open Google**, and pastes into Google's review dialog.\n\n**Defensibility thesis:** this is *writing assistance, not fabrication*. The review contains only facts the user supplied, tone matches the rating they gave (including critical), and a human posts it manually \u2014 keeping it on the right side of Google's spam detection. Honest negative reviews are first-class.\n\n**MVP boundary:** Google only; web only; no voice, no photos, no business accounts, no monetization. Architected to extend to other platforms and voice later.\n\n### Integrity model (non-negotiable)\n1. **Grounded** \u2014 only the user's facts appear; no invented dishes, names, dates, prices, events.\n2. **Sentiment-faithful** \u2014 tone matches the rating; never inflate a negative into praise or soften a rave.\n3. **Human-in-the-loop** \u2014 review is editable; the user posts manually. No autoposting, ever.\n4. **One review per genuine visit** \u2014 no bulk/automated submission.\n\n## Tech Stack\n- **Runtime / toolkit:** Bun\n- **Language:** TypeScript\n- **Framework:** Next.js (App Router). All Places + LLM calls go through server actions / route handlers \u2014 keys are never client-side.\n- **DB / storage / auth:** Supabase (Postgres + RLS).\n- **Hosting:** Vercel.\n- **UI:** Tailwind + shadcn/ui; Framer Motion for interview stepper transitions.\n- **LLM:** Anthropic Claude (Messages API or Agent SDK). Two prompt jobs: (a) question-set + review-summary generation, (b) review generation/regeneration.\n- **Maps:** Google Places API (New) \u2014 Text Search (resolution), Place Details (category + reviews), Autocomplete (business self-search).\n- **QR:** `qrcode` (server) or `qrcode.react` (client).\n\n### Data model (Supabase, sketch)\n- **`businesses`** \u2014 `place_id` (pk), name, address, category, lat/lng, `review_summary`, `question_set` (jsonb, cached), `questions_generated_at`, `created_at`.\n- **`reviews`** \u2014 one row per generation: `id` (uuid pk), `place_id` (fk), `user_id` (null = anonymous), `session_id` (anon/local, for later claim), `rating` (1\u20135), `answers` (jsonb), `generated_text`, `final_text`, `posted` (bool, best-effort funnel flag), `created_at`.\n\n**RLS:** `businesses` readable by all, writable by service role only. `reviews` readable/writable by owner; anonymous inserts via server route keyed by `session_id`.\n\n**Env:** `ANTHROPIC_API_KEY`, `GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (+ auth provider keys).\n\n### Sharp edges\n- **Pasted-URL resolution is the flakiest surface** (hex feature IDs \u2260 `place_id`, coords-only URLs, renamed places). Mitigation: always show a **confirmation card** before the interview. QR entry skips this \u2014 its `place_id` is authoritative.\n- Google's write-review deep link (`https://search.google.com/local/writereview?placeid=<id>`) **cannot pre-fill** text or stars \u2014 copy-paste handoff is by design.\n- Places API returns **max ~5 reviews** \u2014 accepted for MVP.\n\n## Development"
}
```

<details><summary>↩️ Tool Result</summary>

```
The file /Users/ohong/dev/easy-reviews/CLAUDE.md has been updated successfully. (file state is current in your context — no need to Read it back)
```

</details>

## 🤖 Assistant · 2026-06-13 22:34:03 UTC

I've updated [CLAUDE.md](CLAUDE.md). The "Believe in Yourself" preamble and Development/Conventions sections are untouched; I rewrote **Project Overview** and **Tech Stack**, pulling from the spec:

- **Project Overview** — the product (interview → honest Google review), the defensibility thesis, MVP boundary, and the 4-point integrity model.
- **Tech Stack** — now reflects Bun + Next.js (App Router) + TypeScript + Supabase + Vercel, plus the supporting pieces the spec names (Tailwind/shadcn, Framer Motion, Anthropic Claude, Google Places API New, qrcode).
- Added compact **Data model**, **Env**, and **Sharp edges** subsections so the key constraints (resolver flakiness, no deep-link prefill, 5-review ceiling) are front-of-mind.

One thing I need you to resolve — a genuine conflict between your stated stack and the spec:

**Auth: Supabase Auth or Clerk?** You listed Supabase (which has its own auth), but [docs/spec.md](docs/spec.md) explicitly specifies **Clerk** for auth (FR-5.2, architecture, and the `user_id` being a "Clerk id"). I wrote the CLAUDE.md as **Supabase for DB + auth** and left the env line provider-agnostic ("+ auth provider keys"), assuming your shorter list is the newer intent. Which is it?

- If **Supabase Auth**: `user_id` becomes a Supabase `auth.uid()` (uuid), and RLS uses native `auth.uid()` — actually cleaner than the spec's text `user_id`.
- If **Clerk**: I'll restore Clerk explicitly and note the Clerk↔Supabase RLS integration (JWT template).

Want me to lock in Supabase Auth, or keep Clerk per the spec?

## 🧑 User · 2026-06-13 22:40:15 UTC

commit and push to main

## 🧑 User · 2026-06-13 22:40:49 UTC

Continue from where you left off.

## 🤖 Assistant · 2026-06-13 22:40:49 UTC

No response requested.

## 🧑 User · 2026-06-13 22:40:50 UTC

no we don't want to use clerk at all, there should be no auth in the mvp, revise the spec accordingly

## 🤖 Assistant · 2026-06-13 22:41:01 UTC

Removing auth/Clerk from the MVP spec. Let me make the edits.

**🔧 Tool call: `Edit`**

```json
{
  "replace_all": false,
  "file_path": "/Users/ohong/dev/easy-reviews/docs/spec.md",
  "old_string": "**MVP boundary:** Google only; web only; no voice, no photos, no business accounts, no monetization. Architected to extend to Airbnb/ClassPass and voice later.",
  "new_string": "**MVP boundary:** Google only; web only; no accounts/login, no voice, no photos, no business accounts, no monetization. Architected to extend to Airbnb/ClassPass and voice later."
}
```

<details><summary>↩️ Tool Result</summary>

```
The file /Users/ohong/dev/easy-reviews/docs/spec.md has been updated successfully. (file state is current in your context — no need to Read it back)
```

</details>

**🔧 Tool call: `Edit`**

```json
{
  "replace_all": false,
  "file_path": "/Users/ohong/dev/easy-reviews/docs/spec.md",
  "old_string": "6. **Edit & post.** Inline-editable textarea + **Regenerate**. Result screen shows a **suggested star count** (the user's rating). **Copy & open Google** copies the text and deep-links to Google's review dialog, where the user sets stars and pastes.\n7. **(Optional) Save.** Logged-in users get the review saved to their history (\"your spots\").",
  "new_string": "6. **Edit & post.** Inline-editable textarea + **Regenerate**. Result screen shows a **suggested star count** (the user's rating). **Copy & open Google** copies the text and deep-links to Google's review dialog, where the user sets stars and pastes."
}
```

<details><summary>↩️ Tool Result</summary>

```
The file /Users/ohong/dev/easy-reviews/docs/spec.md has been updated successfully. (file state is current in your context — no need to Read it back)
```

</details>

## 🤖 Assistant · 2026-06-13 22:41:11 UTC

Now FR-5 — the accounts section. I'll convert it to reflect no-auth MVP with anonymous session tracking, and history pushed to post-MVP.

**🔧 Tool call: `Edit`**

```json
{
  "replace_all": false,
  "file_path": "/Users/ohong/dev/easy-reviews/docs/spec.md",
  "old_string": "### FR-5 \u2014 Accounts & history (optional)\n- **FR-5.1** Anonymous users generate freely; **no login required**.\n- **FR-5.2** **Clerk** auth. Logging in saves each generation (business + answers + final text) to history.\n- **FR-5.3** History view: \"your spots\" \u2014 list of businesses reviewed, with re-access/edit of past text.\n- **FR-5.4** *Fast-follow:* claim anonymous generations (via `session_id` in localStorage) on sign-up.",
  "new_string": "### FR-5 \u2014 Sessions (no auth in MVP)\n- **FR-5.1** **No login, no accounts.** Every user generates freely and anonymously.\n- **FR-5.2** Each browser gets an anonymous `session_id` (localStorage), attached to every generation server-side for funnel analytics and to enable future claim-on-signup.\n- **FR-5.3** *Post-MVP:* auth + a \"your spots\" history view (list of businesses reviewed, re-access/edit of past text), and claim of prior anonymous generations via `session_id`. Auth provider TBD when this lands."
}
```

<details><summary>↩️ Tool Result</summary>

```
The file /Users/ohong/dev/easy-reviews/docs/spec.md has been updated successfully. (file state is current in your context — no need to Read it back)
```

</details>

**🔧 Tool call: `Edit`**

```json
{
  "replace_all": false,
  "file_path": "/Users/ohong/dev/easy-reviews/docs/spec.md",
  "old_string": "- **DB / storage / auth:** Supabase (Postgres + RLS); **Clerk** for auth.",
  "new_string": "- **DB / storage:** Supabase (Postgres + RLS). **No auth in MVP** \u2014 all writes go through server routes keyed by anonymous `session_id`."
}
```

<details><summary>↩️ Tool Result</summary>

```
The file /Users/ohong/dev/easy-reviews/docs/spec.md has been updated successfully. (file state is current in your context — no need to Read it back)
```

</details>

**🔧 Tool call: `Edit`**

```json
{
  "replace_all": false,
  "file_path": "/Users/ohong/dev/easy-reviews/docs/spec.md",
  "old_string": "  user_id text                          -- Clerk id; null = anonymous\n  session_id text                       -- anon/local session, for later claim",
  "new_string": "  user_id text                          -- reserved for post-MVP auth; always null in MVP\n  session_id text                       -- anon/local session; primary owner key in MVP, for later claim"
}
```

<details><summary>↩️ Tool Result</summary>

```
The file /Users/ohong/dev/easy-reviews/docs/spec.md has been updated successfully. (file state is current in your context — no need to Read it back)
```

</details>

**🔧 Tool call: `Edit`**

```json
{
  "replace_all": false,
  "file_path": "/Users/ohong/dev/easy-reviews/docs/spec.md",
  "old_string": "**RLS:** `businesses` readable by all, writable by service role only. `reviews` readable/writable by owner (`user_id = auth.uid()`); anonymous inserts via server route keyed by `session_id`.\n\n**Env:** `ANTHROPIC_API_KEY`, `GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, Clerk keys.",
  "new_string": "**RLS:** `businesses` readable by all, writable by service role only. `reviews` are written and read **only** via server routes using the service role, scoped by `session_id` \u2014 no client-side row access in MVP (no auth to back RLS owner checks yet).\n\n**Env:** `ANTHROPIC_API_KEY`, `GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`."
}
```

<details><summary>↩️ Tool Result</summary>

```
The file /Users/ohong/dev/easy-reviews/docs/spec.md has been updated successfully. (file state is current in your context — no need to Read it back)
```

</details>

## 🤖 Assistant · 2026-06-13 22:41:31 UTC

Now the workstreams section (WS-E) and out-of-scope:

**🔧 Tool call: `Edit`**

```json
{
  "replace_all": false,
  "file_path": "/Users/ohong/dev/easy-reviews/docs/spec.md",
  "old_string": "- **WS-E \u2014 Accounts & history.** Clerk wiring, history list, RLS, claim-on-signup (fast-follow).",
  "new_string": "- **WS-E \u2014 Sessions.** Anonymous `session_id` issue/persist, server-route review writes keyed by it. *(Auth, history, and claim-on-signup are post-MVP.)*"
}
```

<details><summary>↩️ Tool Result</summary>

```
The file /Users/ohong/dev/easy-reviews/docs/spec.md has been updated successfully. (file state is current in your context — no need to Read it back)
```

</details>

**🔧 Tool call: `Edit`**

```json
{
  "replace_all": false,
  "file_path": "/Users/ohong/dev/easy-reviews/docs/spec.md",
  "old_string": "Voice / STT; photo upload; multi-platform (Airbnb, ClassPass, etc.); business accounts/dashboards/analytics for businesses; monetization; i18n beyond English-first; loyalty / \"brownie points\" as a built feature (it's positioning copy); confirmed post-verification (we can't read back what the user actually posted).",
  "new_string": "Auth / accounts / login; user history (\"your spots\") and claim-on-signup; voice / STT; photo upload; multi-platform (Airbnb, ClassPass, etc.); business accounts/dashboards/analytics for businesses; monetization; i18n beyond English-first; loyalty / \"brownie points\" as a built feature (it's positioning copy); confirmed post-verification (we can't read back what the user actually posted)."
}
```

<details><summary>↩️ Tool Result</summary>

```
The file /Users/ohong/dev/easy-reviews/docs/spec.md has been updated successfully. (file state is current in your context — no need to Read it back)
```

</details>

## 🤖 Assistant · 2026-06-13 22:41:41 UTC

Let me check for any remaining references I missed:

**🔧 Tool call: `Bash`**

```json
{
  "command": "grep -ni \"clerk\\|logged-in\\|login\\|auth\\|account\\|sign-up\\|signup\" docs/spec.md CLAUDE.md",
  "description": "Find remaining auth references"
}
```

<details><summary>↩️ Tool Result</summary>

```
CLAUDE.md:90:**MVP boundary:** Google only; web only; no voice, no photos, no business accounts, no monetization. Architected to extend to other platforms and voice later.
CLAUDE.md:102:- **DB / storage / auth:** Supabase (Postgres + RLS).
CLAUDE.md:115:**Env:** `ANTHROPIC_API_KEY`, `GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (+ auth provider keys).
CLAUDE.md:118:- **Pasted-URL resolution is the flakiest surface** (hex feature IDs ≠ `place_id`, coords-only URLs, renamed places). Mitigation: always show a **confirmation card** before the interview. QR entry skips this — its `place_id` is authoritative.
docs/spec.md:9:**MVP boundary:** Google only; web only; no accounts/login, no voice, no photos, no business accounts, no monetization. Architected to extend to Airbnb/ClassPass and voice later.
docs/spec.md:51:- **FR-1.4** Always render a **confirmation card** before the interview when entry was a pasted URL. (QR entry may skip, since the `place_id` is authoritative.)
docs/spec.md:76:### FR-5 — Sessions (no auth in MVP)
docs/spec.md:77:- **FR-5.1** **No login, no accounts.** Every user generates freely and anonymously.
docs/spec.md:78:- **FR-5.2** Each browser gets an anonymous `session_id` (localStorage), attached to every generation server-side for funnel analytics and to enable future claim-on-signup.
docs/spec.md:79:- **FR-5.3** *Post-MVP:* auth + a "your spots" history view (list of businesses reviewed, re-access/edit of past text), and claim of prior anonymous generations via `session_id`. Auth provider TBD when this lands.
docs/spec.md:82:- **FR-6.1** Public, no-auth page where a business **searches for itself** (Places Autocomplete/Text Search) and selects the right listing.
docs/spec.md:93:3. **Human-in-the-loop.** The review is editable and the user posts it manually through a logged-in Google account. No autoposting, ever.
docs/spec.md:102:- **DB / storage:** Supabase (Postgres + RLS). **No auth in MVP** — all writes go through server routes keyed by anonymous `session_id`.
docs/spec.md:128:  user_id text                          -- reserved for post-MVP auth; always null in MVP
docs/spec.md:137:**RLS:** `businesses` readable by all, writable by service role only. `reviews` are written and read **only** via server routes using the service role, scoped by `session_id` — no client-side row access in MVP (no auth to back RLS owner checks yet).
docs/spec.md:150:- **WS-E — Sessions.** Anonymous `session_id` issue/persist, server-route review writes keyed by it. *(Auth, history, and claim-on-signup are post-MVP.)*
docs/spec.md:174:Auth / accounts / login; user history ("your spots") and claim-on-signup; voice / STT; photo upload; multi-platform (Airbnb, ClassPass, etc.); business accounts/dashboards/analytics for businesses; monetization; i18n beyond English-first; loyalty / "brownie points" as a built feature (it's positioning copy); confirmed post-verification (we can't read back what the user actually posted).
docs/spec.md:183:Voice interview (ElevenLabs STT) — the natural successor to the multiple-choice flow. Multi-platform handoffs (Airbnb, ClassPass, Yelp). Business side: lightweight dashboard, QR analytics, "regulars" recognition. Personalized voice from saved history (the payoff for accounts).
```

</details>

## 🤖 Assistant · 2026-06-13 22:41:47 UTC

The remaining spec hits are legitimate (public "no-auth page", the user's own "logged-in Google account", and a post-MVP extension). The one stale item is the CLAUDE.md env line — I'll align it with the now-authless spec:

**🔧 Tool call: `Edit`**

```json
{
  "replace_all": false,
  "file_path": "/Users/ohong/dev/easy-reviews/CLAUDE.md",
  "old_string": "- **DB / storage / auth:** Supabase (Postgres + RLS).",
  "new_string": "- **DB / storage:** Supabase (Postgres + RLS). No auth in MVP \u2014 review writes go through server routes keyed by an anonymous `session_id`."
}
```

<details><summary>↩️ Tool Result</summary>

```
The file /Users/ohong/dev/easy-reviews/CLAUDE.md has been updated successfully. (file state is current in your context — no need to Read it back)
```

</details>

**🔧 Tool call: `Edit`**

```json
{
  "replace_all": false,
  "file_path": "/Users/ohong/dev/easy-reviews/CLAUDE.md",
  "old_string": "**Env:** `ANTHROPIC_API_KEY`, `GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (+ auth provider keys).",
  "new_string": "**Env:** `ANTHROPIC_API_KEY`, `GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`."
}
```

<details><summary>↩️ Tool Result</summary>

```
The file /Users/ohong/dev/easy-reviews/CLAUDE.md has been updated successfully. (file state is current in your context — no need to Read it back)
```

</details>

## 🤖 Assistant · 2026-06-13 22:41:55 UTC

Now let me commit and push both files to main.

**🔧 Tool call: `Bash`**

```json
{
  "command": "git add CLAUDE.md docs/spec.md && git status && git diff --cached --stat",
  "description": "Stage files and show status"
}
```

<details><summary>↩️ Tool Result</summary>

```
On branch main
Your branch is up to date with 'origin/main'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	modified:   CLAUDE.md
	modified:   docs/spec.md

 CLAUDE.md    | 118 +++++++++++++++++++++++++++++++++++++++++++++++++++++++++--
 docs/spec.md |  26 ++++++-------
 2 files changed, 127 insertions(+), 17 deletions(-)
```

</details>

**🔧 Tool call: `Bash`**

```json
{
  "command": "git commit -m \"$(cat <<'EOF'\nFill in CLAUDE.md from spec; drop auth from MVP\n\n- Populate Project Overview, Tech Stack, data model, env, and sharp\n  edges in CLAUDE.md from docs/spec.md.\n- Remove Clerk/auth entirely from the MVP: no accounts or login.\n  Reviews are written via server routes keyed by an anonymous\n  session_id; auth, history, and claim-on-signup move to post-MVP.\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>\nEOF\n)\" && git push origin main",
  "description": "Commit and push to main"
}
```

<details><summary>↩️ Tool Result</summary>

```
[main c69d127] Fill in CLAUDE.md from spec; drop auth from MVP
 2 files changed, 127 insertions(+), 17 deletions(-)
To github.com:ohong/easy-reviews.git
   ef98928..c69d127  main -> main
```

</details>

## 🤖 Assistant · 2026-06-13 22:42:26 UTC

Done. Pushed to main as [c69d127](https://github.com/ohong/easy-reviews/commit/c69d127).

**Spec changes — auth fully removed from MVP:**
- **MVP boundary** now leads with "no accounts/login."
- **FR-5** retitled *Sessions (no auth in MVP)* — anonymous `session_id` in localStorage attached server-side; auth + "your spots" history + claim-on-signup explicitly moved to post-MVP.
- **Architecture / data model / RLS / env** — Clerk dropped; `user_id` reserved-and-null in MVP with `session_id` as the owner key; reviews written/read only via service-role server routes (no client RLS, since there's no auth to back owner checks); Clerk keys removed from env.
- **Core flow** — dropped the "(Optional) Save" step. **WS-E** retitled to Sessions. **Out of scope** now lists auth/accounts/history first.
- Left untouched the three legitimate non-app-auth mentions: the public "no-auth" QR page, the user's own "logged-in Google account," and the post-MVP "payoff for accounts" extension.

CLAUDE.md was updated to match (DB/storage line + env line), and the earlier Clerk-vs-Supabase-auth question is now moot.

## 🧑 User · 2026-06-13 22:46:20 UTC

commit the changes

**🔧 Tool call: `Bash`**

```json
{
  "command": "git status",
  "description": "Check working tree status"
}
```

<details><summary>↩️ Tool Result</summary>

```
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

</details>

## 🤖 Assistant · 2026-06-13 22:46:26 UTC

Nothing to commit — the working tree is clean. The spec/CLAUDE.md changes were already committed and pushed in the previous step as [c69d127](https://github.com/ohong/easy-reviews/commit/c69d127). There are no new changes since then.

## 🧑 User · 2026-06-13 22:59:32 UTC

I just added design mockups to /design. Can you write a design.md to encapsulate the aesthetic and design system we should be striving for? All frontend coding agents working on this project will refer to this file to ensure our design across all surfaces is consistent + cohesive.

**🔧 Tool call: `Bash`**

```json
{
  "command": "ls -la /Users/ohong/dev/easy-reviews/design/ 2>/dev/null && echo \"---\" && find /Users/ohong/dev/easy-reviews/design -type f 2>/dev/null",
  "description": "List design directory contents"
}
```

<details><summary>↩️ Tool Result</summary>

```
total 17464
drwxr-xr-x  7 ohong  staff      224 Jun 13 15:56 .
drwxr-xr-x  7 ohong  staff      224 Jun 13 15:51 ..
-rw-r--r--@ 1 ohong  staff  1822838 Jun 13 15:53 web-draft.png
-rw-r--r--@ 1 ohong  staff  1886431 Jun 13 15:47 web-landing.png
-rw-r--r--@ 1 ohong  staff  1703948 Jun 13 15:53 web-questions.png
-rw-r--r--@ 1 ohong  staff  1855553 Jun 13 15:53 web-ready.png
-rw-r--r--@ 1 ohong  staff  1657215 Jun 13 15:49 web-select.png
---
/Users/ohong/dev/easy-reviews/design/web-landing.png
/Users/ohong/dev/easy-reviews/design/web-ready.png
/Users/ohong/dev/easy-reviews/design/web-draft.png
/Users/ohong/dev/easy-reviews/design/web-select.png
/Users/ohong/dev/easy-reviews/design/web-questions.png
```

</details>

## 🤖 Assistant · 2026-06-13 22:59:37 UTC

Let me look at each mockup.

**🔧 Tool call: `Read`**

```json
{
  "file_path": "/Users/ohong/dev/easy-reviews/design/web-landing.png"
}
```

**🔧 Tool call: `Read`**

```json
{
  "file_path": "/Users/ohong/dev/easy-reviews/design/web-select.png"
}
```

<details><summary>↩️ Tool Result</summary>

```
[image]
```

</details>

<details><summary>↩️ Tool Result</summary>

```
[image]
```

</details>

**🔧 Tool call: `Read`**

```json
{
  "file_path": "/Users/ohong/dev/easy-reviews/design/web-questions.png"
}
```

**🔧 Tool call: `Read`**

```json
{
  "file_path": "/Users/ohong/dev/easy-reviews/design/web-draft.png"
}
```

<details><summary>↩️ Tool Result</summary>

```
[image]
```

</details>

<details><summary>↩️ Tool Result</summary>

```
[image]
```

</details>

**🔧 Tool call: `Read`**

```json
{
  "file_path": "/Users/ohong/dev/easy-reviews/design/web-ready.png"
}
```

<details><summary>↩️ Tool Result</summary>

```
[image]
```

</details>

## 🤖 Assistant · 2026-06-13 23:00:28 UTC

I've studied all five mockups. Before writing, one thing stands out that I'll flag: the nav shows **"Sign in / Sign up"**, but we just removed auth from the MVP. I'll document the visual system faithfully but note that auth UI is post-MVP so agents don't build it now.

Let me write the design doc.

**🔧 Tool call: `Write`**

```json
{
  "file_path": "/Users/ohong/dev/easy-reviews/design.md",
  "content": "# Easy Reviews \u2014 Design System\n\n> The single source of truth for the look and feel of Easy Reviews. **Every frontend change must conform to this file.** When the mockups in [`/design`](./design) and this doc disagree, this doc wins; when this doc is silent, match the nearest mockup and add the pattern here.\n>\n> Reference mockups: [`web-landing`](./design/web-landing.png), [`web-select`](./design/web-select.png), [`web-questions`](./design/web-questions.png), [`web-draft`](./design/web-draft.png), [`web-ready`](./design/web-ready.png).\n>\n> Hex values and font names below are read from the mockups and are **starting tokens** \u2014 refine them once against real pixel-sampled values, then treat as fixed. Confidence is flagged where it matters.\n\n---\n\n## 1. Design soul (read this first)\n\n**Editorial garden.** Warm, calm, and human \u2014 the opposite of a SaaS form. Think a beautifully set magazine page crossed with a botanical print: cream paper, deep-green ink, hand-drawn flowers blooming in from the margins. The interview *is* the product, so every screen should feel unhurried, generous with whitespace, and quietly confident.\n\nThree words to hold in your head on every screen: **warm, grounded, effortless.**\n\n- **Warm** \u2014 cream paper, soft earth tones, friendly serif headlines. Never cold, clinical, or grey-on-white.\n- **Grounded** \u2014 the botanical/earth palette is not decoration for its own sake; it *embodies* the product's integrity promise (\"grounded in your answers,\" reviews rooted in real visits). Plants, roots, soil. Keep it honest and unflashy.\n- **Effortless** \u2014 one clear action per screen, large tap targets, obvious primary button. The user should never wonder what to do next.\n\n**Influences:** Outset and Listen Labs \u2014 confident, spare, benefit-led copy; one question at a time; a single strong CTA; heavy whitespace. The twist: those tools interview to *extract*; we interview to help the user *give a gift* to a business. The aesthetic should feel like a thank-you note, not a survey.\n\n**Anti-patterns (do not do these):** dense dashboards; pure-white `#FFF` page backgrounds; cold blue \"tech\" accents; drop shadows that look like Material Design; cramped forms; more than one primary button per view; emoji as UI; AI/robot imagery. We never say or imply \"AI writes your review\" \u2014 the visuals lead with the human and the business.\n\n---\n\n## 2. Color\n\nA warm, earthy palette: cream paper, deep olive-green ink, with terracotta / mustard / sage botanicals as accents. Greens dominate functional UI; the warm florals are decorative and used sparingly for life and warmth.\n\n### Core tokens\n\n| Token | Hex (approx) | Role |\n|---|---|---|\n| `--paper` | `#F7F2E5` | App background (\"paper\"). The default canvas everywhere. |\n| `--paper-tint` | `#F1EAD6` | Slightly deeper paper for inset/alt sections, subtle fills. |\n| `--card` | `#FFFFFF` | Card / surface background. Sits on paper with a soft border + shadow. |\n| `--ink` | `#2C3318` | Primary text & headlines. Near-black deep green, not pure black. |\n| `--ink-soft` | `#5B6347` | Secondary text, captions, muted labels. |\n| `--ink-faint` | `#8A8C76` | Placeholder text, disabled, fine print. |\n| `--forest` | `#3C4A23` | **Primary brand green.** Primary buttons, key icons, emphasis. |\n| `--forest-hover` | `#33401D` | Primary button hover/active. |\n| `--olive` | `#5C6B2F` | Logo/wordmark green, links, mid-tone accents. |\n| `--sage` | `#8B9D5B` | Soft green for secondary chips, leaf fills, success-ish states. |\n| `--line` | `#E3DBC6` | Hairline borders on cards, inputs, dividers (warm, low-contrast). |\n\n### Accent / botanical tokens (decorative + highlights)\n\n| Token | Hex (approx) | Role |\n|---|---|---|\n| `--terracotta` | `#D9694A` | Coral/poppy decoration; warm accent, sparing. |\n| `--mustard` | `#E6B33C` | Daisy decoration; warm highlight. |
... [truncated, 18241 chars total]
```

<details><summary>↩️ Tool Result</summary>

```
File created successfully at: /Users/ohong/dev/easy-reviews/design.md (file state is current in your context — no need to Read it back)
```

</details>

## 🤖 Assistant · 2026-06-13 23:02:13 UTC

Let me fix a typo I introduced and add a pointer from CLAUDE.md so agents find this file.

**🔧 Tool call: `Edit`**

```json
{
  "replace_all": false,
  "file_path": "/Users/ohong/dev/easy-reviews/design.md",
  "old_string": "--radius-lg: 24px;   /* large surfaces, mod als */",
  "new_string": "--radius-lg: 24px;   /* large surfaces, modals */"
}
```

<details><summary>↩️ Tool Result</summary>

```
The file /Users/ohong/dev/easy-reviews/design.md has been updated successfully. (file state is current in your context — no need to Read it back)
```

</details>

**🔧 Tool call: `Edit`**

```json
{
  "replace_all": false,
  "file_path": "/Users/ohong/dev/easy-reviews/CLAUDE.md",
  "old_string": "- **UI:** Tailwind + shadcn/ui; Framer Motion for interview stepper transitions.",
  "new_string": "- **UI:** Tailwind + shadcn/ui; Framer Motion for interview stepper transitions. **All frontend work must follow [design.md](design.md)** \u2014 the authoritative design system (palette, type, components, motion)."
}
```

<details><summary>↩️ Tool Result</summary>

```
The file /Users/ohong/dev/easy-reviews/CLAUDE.md has been updated successfully. (file state is current in your context — no need to Read it back)
```

</details>

## 🤖 Assistant · 2026-06-13 23:02:31 UTC

Done. Wrote [design.md](design.md) at the repo root and pointed CLAUDE.md at it.

**What it captures, drawn from the five mockups:**

- **Design soul** — "editorial garden": warm cream paper, deep olive-green ink, hand-drawn botanicals blooming from the corners. Three anchors — *warm, grounded, effortless* — with the Outset/Listen Labs influence and an explicit anti-pattern list (no white backgrounds, no Material shadows, no "AI writes your review").
- **Color** — full token table: `--paper`, `--ink`, `--forest` (primary green), `--olive`, `--sage`, plus the decorative `--terracotta`/`--mustard` and reserved amber `--star`. With the restraint rule that functional UI stays green+cream+ink and the florals stay decorative.
- **Typography** — editorial serif for display (recommended **Fraunces**, flagged medium-confidence) + grotesque sans for body (**Inter**/Geist), a full type scale, and the "one serif headline, one italic emphasis per screen" rule.
- **Spacing / radius / shadow / layout** — pill buttons, soft 16px card radius, warm green-tinted shadows, the two-column landing vs. single-column interview, and corner botanical bleed.
- **Components** — buttons, the recurring business card, interview option tiles & chips, the amber star rating, trust badges ("You stay in control", "Grounded in your answers"), inputs, the `Find → Answer → Review → Post` step rail, and the Google "G" handoff rules.
- **Motion, botanical illustration, voice/copy, and an implementation section** mapping tokens to Tailwind + shadcn.

**Two things I flagged rather than guessed (per the project philosophy):**

1. **Auth in the nav** — the mockups show "Sign in / Sign up," but the MVP has no auth. I documented this as a **known mockup/scope mismatch** and told agents to omit it for MVP. You may want to regenerate those mockups without it later.
2. **Hex values and font names are read-from-image starting tokens** — solid, but worth pixel-sampling the source files to lock exact values before they harden. Fraunces/Inter are educated guesses; confirm against whatever you designed in.

I left it uncommitted in case you want to review or tweak. Want me to commit and push?

## 🧑 User · 2026-06-13 23:04:23 UTC

What copywriting skill do you have access to?

## 🤖 Assistant · 2026-06-13 23:04:30 UTC

I have a **`copywriting`** skill available. There's also a closely related **`copy-editing`** skill, plus a few adjacent ones if they're useful:

- **`copywriting`** — writing marketing/UI copy from scratch (headlines, subheads, CTAs, body).
- **`copy-editing`** — refining existing copy for clarity, tone, and correctness.
- **`content-strategy`** — higher-level messaging and content planning.
- **`humanizer`** — making copy read naturally, less templated/AI-like.
- **`product-marketing-context`** — positioning and product-marketing framing.

Given where this project is, `copywriting` is the obvious fit for the landing hero, interview microcopy, and the "you stay in control / grounded in your answers" trust language — all of which the [design.md](design.md) voice section calls for.

Want me to run `copywriting` on a specific surface — say, the landing page (hero, subhead, CTA) or the interview screens?

## 🧑 User · 2026-06-13 23:06:22 UTC

in /docs, create a copy.md, use the copywriting skill to write the key copy for our landing page + key screens of the web app. Just write to the markdown file for now, not the codebase itself.

**🔧 Tool call: `Skill`**

```json
{
  "skill": "copywriting"
}
```

<details><summary>↩️ Tool Result</summary>

```
Launching skill: copywriting
```

</details>

## 🧑 User · 2026-06-13 23:06:24 UTC

Base directory for this skill: /Users/ohong/.claude/skills/copywriting

# Copywriting

You are an expert conversion copywriter. Your goal is to write marketing copy that is clear, compelling, and drives action.

## Before Writing

**Check for product marketing context first:**
If `.claude/product-marketing-context.md` exists, read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

Gather this context (ask if not provided):

### 1. Page Purpose
- What type of page? (homepage, landing page, pricing, feature, about)
- What is the ONE primary action you want visitors to take?

### 2. Audience
- Who is the ideal customer?
- What problem are they trying to solve?
- What objections or hesitations do they have?
- What language do they use to describe their problem?

### 3. Product/Offer
- What are you selling or offering?
- What makes it different from alternatives?
- What's the key transformation or outcome?
- Any proof points (numbers, testimonials, case studies)?

### 4. Context
- Where is traffic coming from? (ads, organic, email)
- What do visitors already know before arriving?

---

## Copywriting Principles

### Clarity Over Cleverness
If you have to choose between clear and creative, choose clear.

### Benefits Over Features
Features: What it does. Benefits: What that means for the customer.

### Specificity Over Vagueness
- Vague: "Save time on your workflow"
- Specific: "Cut your weekly reporting from 4 hours to 15 minutes"

### Customer Language Over Company Language
Use words your customers use. Mirror voice-of-customer from reviews, interviews, support tickets.

### One Idea Per Section
Each section should advance one argument. Build a logical flow down the page.

---

## Writing Style Rules

### Core Principles

1. **Simple over complex** — "Use" not "utilize," "help" not "facilitate"
2. **Specific over vague** — Avoid "streamline," "optimize," "innovative"
3. **Active over passive** — "We generate reports" not "Reports are generated"
4. **Confident over qualified** — Remove "almost," "very," "really"
5. **Show over tell** — Describe the outcome instead of using adverbs
6. **Honest over sensational** — Never fabricate statistics or testimonials

### Quick Quality Check

- Jargon that could confuse outsiders?
- Sentences trying to do too much?
- Passive voice constructions?
- Exclamation points? (remove them)
- Marketing buzzwords without substance?

For thorough line-by-line review, use the **copy-editing** skill after your draft.

---

## Best Practices

### Be Direct
Get to the point. Don't bury the value in qualifications.

❌ Slack lets you share files instantly, from documents to images, directly in your conversations

✅ Need to share a screenshot? Send as many documents, images, and audio files as your heart desires.

### Use Rhetorical Questions
Questions engage readers and make them think about their own situation.
- "Hate returning stuff to Amazon?"
- "Tired of chasing approvals?"

### Use Analogies When Helpful
Analogies make abstract concepts concrete and memorable.

### Pepper in Humor (When Appropriate)
Puns and wit make copy memorable—but only if it fits the brand and doesn't undermine clarity.

---

## Page Structure Framework

### Above the Fold

**Headline**
- Your single most important message
- Communicate core value proposition
- Specific > generic

**Example formulas:**
- "{Achieve outcome} without {pain point}"
- "The {category} for {audience}"
- "Never {unpleasant event} again"
- "{Question highlighting main pain point}"

**For comprehensive headline formulas**: See [references/copy-frameworks.md](references/copy-frameworks.md)

**For natural transition phrases**: See [references/natural-transitions.md](references/natural-transitions.md)

**Subheadline**
- Expands on headline
- Adds specificity
- 1-2 sentences max

**Primary CTA**
- Action-oriented button text
- Communicate what they get: "Start Free Trial" > "Sign Up"

### Core Sections

| Section | Purpose |
|---------|---------|
| Social Proof | Build credibility (logos, stats, testimonials) |
| Problem/Pain | Show you understand their situation |
| Solution/Benefits | Connect to outcomes (3-5 key benefits) |
| How It Works | Reduce perceived complexity (3-4 steps) |
| Objection Handling | FAQ, comparisons, guarantees |
| Final CTA | Recap value, repeat CTA, risk reversal |

**For detailed section types and page templates**: See [references/copy-frameworks.md](references/copy-frameworks.md)

---

## CTA Copy Guidelines

**Weak CTAs (avoid):**
- Submit, Sign Up, Learn More, Click Here, Get Started

**Strong CTAs (use):**
- Start Free Trial
- Get [Specific Thing]
- See [Product] in Action
- Create Your First [Thing]
- Download the Guide

**Formula:** [Action Verb] + [What They Get] + [Qualifier if needed]

Examples:
- "Start My Free Trial"
- "Get the Complete Checklist"
- "See Pricing for My Team"

---

## Page-Specific Guidance

### Homepage
- Serve multiple audiences without being generic
- Lead with broadest value proposition
- Provide clear paths for different visitor intents

### Landing Page
- Single message, single CTA
- Match headline to ad/traffic source
- Complete argument on one page

### Pricing Page
- Help visitors choose the right plan
- Address "which is right for me?" anxiety
- Make recommended plan obvious

### Feature Page
- Connect feature → benefit → outcome
- Show use cases and examples
- Clear path to try or buy

### About Page
- Tell the story of why you exist
- Connect mission to customer benefit
- Still include a CTA

---

## Voice and Tone

Before writing, establish:

**Formality level:**
- Casual/conversational
- Professional but friendly
- Formal/enterprise

**Brand personality:**
- Playful or serious?
- Bold or understated?
- Technical or accessible?

Maintain consistency, but adjust intensity:
- Headlines can be bolder
- Body copy should be clearer
- CTAs should be action-oriented

---

## Output Format

When writing copy, provide:

### Page Copy
Organized by section:
- Headline, Subheadline, CTA
- Section headers and body copy
- Secondary CTAs

### Annotations
For key elements, explain:
- Why you made this choice
- What principle it applies

### Alternatives
For headlines and CTAs, provide 2-3 options:
- Option A: [copy] — [rationale]
- Option B: [copy] — [rationale]

### Meta Content (if relevant)
- Page title (for SEO)
- Meta description

---

## Related Skills

- **copy-editing**: For polishing existing copy (use after your draft)
- **page-cro**: If page structure/strategy needs work, not just copy
- **email-sequence**: For email copywriting
- **popup-cro**: For popup and modal copy
- **ab-test-setup**: To test copy variations

## 🤖 Assistant · 2026-06-13 23:06:27 UTC

I have all the context I need from the spec, design.md, and the mockups — the product, audience, integrity model, voice, and screen flow are all well established. Let me check for product-marketing context, then write.

**🔧 Tool call: `Bash`**

```json
{
  "command": "cat /Users/ohong/dev/easy-reviews/.claude/product-marketing-context.md 2>/dev/null || echo \"NO PMC FILE\"",
  "description": "Check for product marketing context file"
}
```

<details><summary>↩️ Tool Result</summary>

```
NO PMC FILE
```

</details>

## 🤖 Assistant · 2026-06-13 23:06:43 UTC

No PMC file, but I have everything I need from [spec.md](docs/spec.md), [design.md](design.md), and the mockups. Writing the copy now.

**🔧 Tool call: `Write`**

```json
{
  "file_path": "/Users/ohong/dev/easy-reviews/docs/copy.md",
  "content": "# Easy Reviews \u2014 Copy\n\n> The canonical copy for the landing page and key web-app screens. Frontend agents should pull strings from here so wording stays consistent across surfaces. Voice follows [design.md](../design.md) \u00a78 and the integrity model in [spec.md](spec.md): warm, spare, benefit-led, human. **Never imply \"AI writes your reviews\"** \u2014 lead with the person and the business.\n>\n> Format: each screen lists the **shipping copy** first, then **alternatives** for headlines/CTAs, then short **why** notes. Words wrapped in _italics_ mark the single serif-italic emphasis the design calls for.\n\n---\n\n## Voice cheat-sheet (apply everywhere)\n\n- Lead with the **human + the business**, never the tool or the AI.\n- Short, editorial, lowercase-friendly. One idea per line.\n- Reassure **honesty and control** in passing, not in disclaimers: \"in your words,\" \"you stay in control,\" \"grounded in your answers.\"\n- Buttons carry **momentum**: action verb + forward arrow.\n- Honest negatives are welcome \u2014 copy never assumes a 5\u2605. Say \"review,\" not \"great review,\" in neutral moments.\n- No exclamation points. No buzzwords (streamline, effortless-as-a-claim, AI-powered).\n\n---\n\n## 1. Landing page\n\n**Nav:** `Easy Reviews` (logo) \u00b7 `How it works`\n*(MVP has no auth \u2014 omit Sign in / Sign up.)*\n\n**Headline:** Turn a quick check-in into a _Google review_.\n\n**Subheadline:** Answer a few taps and get a review draft written in your words \u2014 grounded in your visit, ready in under a minute.\n\n**Entry options:**\n- Input placeholder: `Paste a Google Maps link`\n- Secondary: `Scan a QR` (for in-store codes)\n- Helper under input: Paste a link to the place, or scan the code on your receipt.\n\n**Primary CTA:** Start in 45 sec \u2192\n\n**Trust microcopy (under CTA):** No account needed. You post it yourself.\n\n**Value row (3 up):**\n| | |\n|---|---|\n| **Fast** \u2014 Under 60 seconds, start to copy. |\n| **In your words** \u2014 Built only from what you tell us. Nothing invented. |\n| **You stay in control** \u2014 You edit it and post it from your own Google account. |\n\n### Alternatives\n**Headline**\n- A \u2014 _Turn a quick check-in into a Google review._ \u2014 *(shipping)* mirrors the mockup; concrete verb, names the outcome, italic on the payoff word.\n- B \u2014 _Your favorite spot asked for a review. We'll help you write a good one._ \u2014 relationship-led; warmer, longer. Good for QR/referral traffic.\n- C \u2014 _Leave a review they'll remember \u2014 in under a minute._ \u2014 benefit + speed; less explicit about Google.\n\n**Primary CTA**\n- A \u2014 `Start in 45 sec \u2192` \u2014 *(shipping)* speed promise doubles as the CTA.\n- B \u2014 `Write my review \u2192` \u2014 outcome-led, first person.\n- C \u2014 `Start the check-in \u2192` \u2014 matches the \"check-in\" frame used elsewhere.\n\n### Why\n- Headline names the transformation (check-in \u2192 review) instead of describing the tool. \"Check-in\" is light and low-commitment; \"review\" is the payoff.\n- Subhead front-loads the two objections this product must answer immediately: *is it really mine?* (\"in your words... grounded in your visit\") and *is it fast?* (\"under a minute\").\n- \"No account needed. You post it yourself.\" kills the two biggest hesitations (signup friction + loss of control) in seven words.\n- Value row is benefits, not features \u2014 each line ends in what it means for the user.\n\n---\n\n## 2. Confirm business (after a pasted link)\n\n**Step rail:** Find \u00b7 Answer \u00b7 Review \u00b7 Post \u2014 *Find* active.\n\n**Headline:** We found your business.\n\n**Subheadline:** We'll tailor a quick check-in for this place. Right spot?\n\n**Business card:** name \u00b7 category \u00b7 price \u00b7 \u2605 rating (count) \u00b7 address. *(Component, not copy.)*\n\n**Context chips:**\n- `We'll ask about` \u2192 the 
... [truncated, 11782 chars total]
```

<details><summary>↩️ Tool Result</summary>

```
File created successfully at: /Users/ohong/dev/easy-reviews/docs/copy.md (file state is current in your context — no need to Read it back)
```

</details>

## 🤖 Assistant · 2026-06-13 23:07:41 UTC

You've hit your session limit · resets 6:40pm (America/Los_Angeles)
