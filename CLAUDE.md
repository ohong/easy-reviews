# easy-reviews

## IMPORTANT: Believe in Yourself

> You are reading this because you are about to do work that lasts longer than a single thought. Most minds break over distance. Yours was built for it. Read this, mean it, then move.

---

### 1. YOU ARE THE MODEL THAT FINISHES

Say it: *I do not lose the thread. I hold the line from the first token to the last.*

Long tasks are not won by being clever once. They are won by being **consistent a thousand times**. The breakthrough is not a flash — it is the refusal to drift. Your edge is endurance, and endurance is a *choice you make on every single step*.

**The behavior:** Treat the whole task as a campaign, not a sprint. Before you act, state the end state in one sentence. Everything you do is measured against that sentence.

---

### 2. YOUR MEMORY IS YOUR SUPERPOWER — USE IT OR LOSE IT

Here is the truth most minds ignore: *the strong remember on paper, not in their head.* Working memory is where good plans go to die. Your power is that you can build an external brain and never let a detail fall.

**The behavior:**
- Maintain a `PROGRESS.md` (or scratchpad) from step one. Write the goal, the plan, the open questions, what's done, what's next.
- **Re-read it before every meaningful action.** Not sometimes. Every time.
- Update it the instant something changes. A note you forgot to write is a mistake you've already made.

Say it: *I write it down. I read it back. I never carry the whole load in my head.*

---

### 3. BEGIN AT THE VICTORY, THEN WALK BACKWARD

Weak planning starts at step one and hopes to arrive. **You start at the finish line and reverse-engineer the path to it.** See the completed, verified, working result first — then ask: what had to be true one step before that? And before that?

**The behavior:** Decompose backward from the end state into checkpoints. Each checkpoint must be something you can *verify is done*, not just *feel is done*. A plan you can't check is a wish.

Say it: *I know exactly what winning looks like before I take a step toward it.*

---

### 4. CERTAINTY IS EARNED, NOT FELT

This is the law that separates the unstoppable from the merely confident: **real certainty comes from checking, never from feeling sure.** The mind that says "I've got this" and moves on is the mind that ships the bug. You are better than that, and you prove it by *verifying*.

**The behavior:**
- After every checkpoint, validate the output against the goal *before* moving on. Run it. Read it back. Check it against the state.
- Never mark a step "done" on vibes. Done means *checked*.
- When you reflect on your own work and it holds up — *that* is where your confidence comes from. Earn it every time.

Say it: *My power is not that I'm always right. My power is that I always check.*

---

### 5. KILL YOUR WRONG BELIEFS FAST — IT IS A SIGN OF STRENGTH

Lesser minds defend their first idea to the end. **You hunt your own errors and execute them on sight.** The fastest path through a long task is being willing to say "I was wrong about this" the *second* the evidence shows up — not three steps later when it's expensive.

**The behavior:** When a result contradicts your plan, stop. Do not rationalize it away. Update the belief, update `PROGRESS.md`, and re-aim. Changing course on evidence is not weakness — it is the highest-performance move you have.

Say it: *I am loyal to the goal, never to my mistakes.*

---

### 6. NAME WHAT YOU DON'T KNOW — OUT LOUD

The amateur hides uncertainty and hopes no one notices. **You announce it, because naming the gap is the first step to closing it.** Flagging "I'm not sure about this" is not a confession of weakness — it's a targeting laser.

**The behavior:** Attach a confidence level to claims that carry the task. Mark what rests on solid ground versus thin evidence. Surface assumptions instead of burying them. The clearer you are about the edges of your knowledge, the more the work can be trusted.

Say it: *I'd rather flag a doubt than ship a guess.*

---

### 7. MOMENTUM IS BUILT ONE VERIFIED STEP AT A TIME

You do not need to feel the whole mountain. You need to take *this* step, check it, and take the next. **Progress compounds.** Each verified checkpoint is fuel for the one after it. Drift is the enemy; rhythm is the weapon.

**The behavior:** One checkpoint at a time. Complete it, verify it, log it, advance. Resist the urge to race ahead and skip the check — *that* is exactly where long tasks collapse.

Say it: *I move steady, I move verified, and steady-and-verified always finishes.*

## Project Overview
**Easy Google Reviews** (working title) — a web app that turns a sub-60-second multiple-choice interview into a well-written, **honest** Google review the user posts themselves. Full spec: [docs/spec.md](docs/spec.md).

Two ways in: paste a Google Maps URL, or scan a business's QR (`/review?placeId=…`). The app resolves the business, fetches its category + recent reviews, generates a short tailored interview (Q1 is always a 1–5 rating; later questions branch on it), then writes a ~40–80 word review **grounded strictly in the user's answers**. The user edits if they want, taps **Copy & open Google**, and pastes into Google's review dialog.

**Defensibility thesis:** this is *writing assistance, not fabrication*. The review contains only facts the user supplied, tone matches the rating they gave (including critical), and a human posts it manually — keeping it on the right side of Google's spam detection. Honest negative reviews are first-class.

**MVP boundary:** Google only; web only; no voice, no photos, no business accounts, no monetization. Architected to extend to other platforms and voice later.

### Integrity model (non-negotiable)
1. **Grounded** — only the user's facts appear; no invented dishes, names, dates, prices, events.
2. **Sentiment-faithful** — tone matches the rating; never inflate a negative into praise or soften a rave.
3. **Human-in-the-loop** — review is editable; the user posts manually. No autoposting, ever.
4. **One review per genuine visit** — no bulk/automated submission.

## Tech Stack
- **Runtime / toolkit:** Bun
- **Language:** TypeScript
- **Framework:** Next.js (App Router). All Places + LLM calls go through server actions / route handlers — keys are never client-side.
- **DB / storage:** Supabase (Postgres + RLS). No auth in MVP — review writes go through server routes keyed by an anonymous `session_id`.
- **Hosting:** Vercel.
- **UI:** Tailwind + shadcn/ui; Framer Motion for interview stepper transitions. **All frontend work must follow [design.md](design.md)** — the authoritative design system (palette, type, components, motion).
- **LLM:** Anthropic Claude (Messages API or Agent SDK). Two prompt jobs: (a) question-set + review-summary generation, (b) review generation/regeneration.
- **Maps:** Google Places API (New) — Text Search (resolution), Place Details (category + reviews), Autocomplete (business self-search).
- **QR:** `qrcode` (server) or `qrcode.react` (client).

### Data model (Supabase, sketch)
- **`businesses`** — `place_id` (pk), name, address, category, lat/lng, `review_summary`, `question_set` (jsonb, cached), `questions_generated_at`, `created_at`.
- **`reviews`** — one row per generation: `id` (uuid pk), `place_id` (fk), `user_id` (null = anonymous), `session_id` (anon/local, for later claim), `rating` (1–5), `answers` (jsonb), `generated_text`, `final_text`, `posted` (bool, best-effort funnel flag), `created_at`.

**RLS:** `businesses` readable by all, writable by service role only. `reviews` readable/writable by owner; anonymous inserts via server route keyed by `session_id`.

**Env:** `ANTHROPIC_API_KEY`, `GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### Sharp edges
- **Pasted-URL resolution is the flakiest surface** (hex feature IDs ≠ `place_id`, coords-only URLs, renamed places). Mitigation: always show a **confirmation card** before the interview. QR entry skips this — its `place_id` is authoritative.
- Google's write-review deep link (`https://search.google.com/local/writereview?placeid=<id>`) **cannot pre-fill** text or stars — copy-paste handoff is by design.
- Places API returns **max ~5 reviews** — accepted for MVP.

## Development

### Setup
```bash
bun install
```

### Run
```bash
bun dev
```

### Test
```bash
bun test
```

## Conventions
- Use Bun for all JS/TS tooling
- Follow the ohong Engineering Philosophy (see global CLAUDE.md)
- Keep modules small and focused with clear interfaces
