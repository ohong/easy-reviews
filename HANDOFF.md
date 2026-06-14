# HANDOFF — Easy Google Reviews (continue the build)

You are taking over an in-progress build. This document is your full briefing. Read it top to bottom, then read the source-of-truth docs it points to, then continue from **Immediate next steps**.

---

## 0. Read these first (in order)
1. **`docs/spec.md`** — the product/functional spec (FR-1…FR-6, flow, data model, integrity model). This is *what* to build.
2. **`MVP_GUIDELINES.md`** — the build rulebook. **It wins on any infra conflict with the spec.** (This is why we use SQLite/Drizzle/Better Auth, NOT the spec's Supabase/Clerk/Vercel.)
3. **`CLAUDE.md`** — project instructions. Note the **"Believe in Yourself" working-style preamble** the user added: maintain **`PROGRESS.md`** and re-read it before major actions; plan backward from the finish; **verify every checkpoint by running it, not by vibes**; kill wrong beliefs fast; flag uncertainty out loud.
4. **`PROGRESS.md`** — living checklist of what's done/left (keep it updated).
5. Memory: `~/.claude/projects/-Users-wraith-dev-projects-hackathons-easy-reviews/memory/` → `build-decisions.md` (locked scope) and `easy-reviews-architecture.md` (verified API/stack facts — **read this; it has the exact Places/Anthropic/Better Auth/Drizzle/shadcn gotchas**).

## 1. What we're building (1 paragraph)
A web app that turns a **<60-second multiple-choice interview** into an **honest, well-written Google review the user posts themselves**. Entry: paste a Google Maps URL **or** scan a business QR (`/review?placeId=…`). The app resolves the business, pulls its category + up to 5 reviews, generates a short tailored interview (Q1 is always a 1–5 rating), then ghostwrites a ~40–80 word review **grounded strictly in the user's answers**, tone matched to the rating (honest negatives are first-class). User edits → **Copy & open Google** (clipboard + `https://search.google.com/local/writereview?placeid=<id>`) → pastes + sets stars. **Integrity model (non-negotiable):** grounded (no invented facts), sentiment-faithful, human-in-the-loop (no autoposting), one review per visit. That posture is the product's right to exist.

## 2. Locked decisions (confirmed with the user — do not relitigate)
- **Stack:** MVP_GUIDELINES wins → **Next.js 16 + SQLite/Drizzle (`better-sqlite3`) + Better Auth + Tailwind v4/shadcn + `motion`**, deploy via **Docker Compose + Caddy** on one EC2 box. Spec's Supabase/Clerk/Vercel are overridden.
- **API keys:** build for **live** Google Places (New) + Anthropic. User provides keys in `.env`. **`GOOGLE_API_KEY` is present and verified live. `ANTHROPIC_API_KEY` is NOT set yet** — generation paths are written + typecheck-clean but not smoke-tested live. Env is validated in `lib/env.ts` (core keys optional at boot so build/landing work; `require*()` throws a clear error when a feature is used without its key).
- **Auth:** anonymous-first. Core flow needs no login (`session_id` in localStorage via `lib/session.ts`). Better Auth Google OAuth + history is a secondary layer (WS-E, not built).
- **QR self-serve (FR-6):** in scope (WS-F, not built — `/for-business` is a placeholder).

## 3. Stack facts / gotchas (verified — full detail in memory `easy-reviews-architecture.md`)
- **Next 16:** middleware is **`proxy.ts`** (root, `export function proxy`, Node runtime). `cookies()`/`headers()` async; `params`/`searchParams` are **Promises** (await them). Turbopack default (no `--turbopack` flag). `next lint` removed. `output: 'standalone'` (set) — Docker must copy `public/` + `.next/static` + `./drizzle` into the standalone dir.
- **Structured LLM output = forced tool use** (`tools:[{name,input_schema}]` + `tool_choice:{type:'tool',name}`) then Zod-validate `block.input` with one retry. Model `claude-opus-4-8` (env `ANTHROPIC_MODEL`). `thinking` omitted for latency. (Chosen over `output_config.format` to avoid zod-v4↔SDK coupling.)
- **Places (New):** host `places.googleapis.com/v1`, `X-Goog-Api-Key` + `X-Goog-FieldMask` headers. Reviews capped at 5 and bill at Enterprise+Atmosphere — only pulled once per business at interview prep (cached). `id`/`placeId` is the bare `ChIJ…` and works directly in the writereview deep link.
- **Better Auth 1.6.18:** `drizzleAdapter` from `better-auth/adapters/drizzle` (provider `sqlite`); `anonymous()` from `better-auth/plugins`; **`nextCookies()` from `better-auth/next-js` MUST be the last plugin**; mount at `app/api/auth/[...all]/route.ts` via `toNextJsHandler(auth)`; client `better-auth/react` + `anonymousClient()`; server session `auth.api.getSession({ headers: await headers() })`. Schema tables already exist in `lib/db/schema.ts` (`user`/`session`/`account`/`verification`, +`isAnonymous`).
- **Drizzle 0.45 / better-sqlite3:** index callback returns an **array**; timestamps `integer({mode:'timestamp'})` default `sql\`(unixepoch())\``; JSON `text({mode:'json'}).$type<T>()`. Migrations auto-apply on boot via **`instrumentation.ts`** (sync migrator). `foreign_keys=ON` is per-connection (set in `lib/db/index.ts`).
- **shadcn = v4 + Base UI** (`@base-ui/react`), preset `base-nova` — **NOT Radix**. Polymorphism is the **`render` prop**, e.g. `<Button render={<Link href="/x" />}>…</Button>` (not `asChild`). Tailwind v4 CSS-first in `app/globals.css` (OKLCH tokens, `@theme inline`, no config file). Animation = **`motion`** (not framer-motion), import from `motion/react`.
- **Security (MVP_GUIDELINES §6/§8):** all DB access + secrets live in `server-only` `lib/` modules. **Validate every Server Action input with Zod AND check ownership** (anonymous = `session_id`, owned = `user_id`) — see `lib/services/reviews.ts` `assertOwner`. Never put a secret behind `NEXT_PUBLIC_`.

## 4. Repo map (what exists now)
```
app/
  layout.tsx              # fonts (Geist + Fraunces serif + Geist Mono), metadata, <Toaster>, header/footer
  page.tsx                # landing (hero + PasteForm + how-it-works + integrity)
  globals.css             # Tailwind v4, warm editorial OKLCH tokens, shadcn base
  actions.ts              # resolveUrlAction (entry → /review/[id]?confirm=1 or /start?q=)
  error.tsx, global-error.tsx, loading.tsx, not-found.tsx
  _components/paste-form.tsx          # useActionState form
  start/page.tsx, start/actions.ts (searchBusinessesAction), start/_components/business-search.tsx
  review/[placeId]/
    page.tsx              # server: getPlaceSummary → <ReviewFlow needsConfirm>
    actions.ts            # prepareInterviewAction, generateReviewAction, regenerateReviewAction, saveFinalTextAction, markPostedAction
    _components/          # review-flow (state machine), confirm-card, interview (stepper), result
  for-business/page.tsx   # PLACEHOLDER (WS-F not built)
components/
  site-header.tsx, site-footer.tsx
  ui/                     # shadcn: button card input textarea label badge sonner skeleton dialog progress + star-rating.tsx (custom)
lib/
  env.ts                 # Zod-validated env + features flags + require* helpers (server-only)
  types.ts               # QuestionSet/InterviewAnswers contract, writeReviewUrl(), ratingBranch()
  places.ts              # Places New client: searchPlaces, getPlaceSummary, getPlaceDetails, autocompletePlaces
  anthropic.ts           # client + MODEL
  resolve.ts             # parseMapsUrl + resolveMapsInput (short-link expand, place_id/name/coords extraction)
  session.ts             # getSessionId() (localStorage)
  validations.ts         # Zod schemas for action inputs
  auth-session.ts        # getOptionalUserId() — STUB returning null; wire to Better Auth in WS-E
  ai/ schemas.ts, generate.ts   # generateReviewSummary, generateQuestionSet, generateReview (forced tool-use)
  db/ index.ts (pragmas), schema.ts (businesses, reviews, auth tables), migrate.ts
  services/ interview.ts (prepareInterview + cache, getStoredBusiness), reviews.ts (save/get/update/replace/markPosted/delete/history/claim)
drizzle/                 # generated migration 0000_*.sql (applied; data/app.db exists locally)
instrumentation.ts       # runs migrations on boot
next.config.ts           # output standalone + serverExternalPackages + outputFileTracingIncludes(drizzle)
drizzle.config.ts, .env.example, PROGRESS.md
```

## 5. DONE + verified
- Scaffold, config, env validation, DB layer (6 tables, migration applied), AI core (Places verified **live**), **full consumer happy-path** (entry → resolve → confirm → interview → generate → result), landing, manual search, error boundaries, design shell.
- **`bun run typecheck` = clean. `bun run build` = passes** (routes `/` ○, `/for-business` ○, `/review/[placeId]` ƒ, `/start` ƒ).

## 6. LEFT to do (with specifics)
**A. Live smoke-test once `ANTHROPIC_API_KEY` is set** (highest priority when key arrives): `bun dev`, paste a Maps URL → confirm → interview → verify a grounded, sentiment-matched review generates; test Regenerate, edit, Copy & open Google, and a 1–2★ negative path. Check `data/app.db` rows.

**B. WS-E — Accounts & history.** Create `lib/auth.ts` (betterAuth + drizzleAdapter(sqlite) + `anonymous()` + Google social provider **only if `features.googleAuth`** + `nextCookies()` last; guard so missing secret/clientId doesn't crash — anonymous-first). `app/api/auth/[...all]/route.ts`. `lib/auth-client.ts`. Replace `lib/auth-session.ts` stub body with real `auth.api.getSession`. Add header auth nav (login/your spots/logout) — a client component in `site-header`. `app/history/page.tsx` ("your spots", uses `getHistoryForUser`). Settings page with **delete account** (legally required) that deletes user + their reviews + sessions. `proxy.ts` for optimistic redirects (not the security boundary). Fast-follow: call `claimAnonymousReviews(sessionId, userId)` on sign-up (`onLinkAccount`). Generate any new Better Auth columns with `bunx @better-auth/cli generate` if the hand-written schema is missing fields, then `bun run db:generate && db:migrate`.

**C. WS-F — Business QR self-serve.** Replace `app/for-business/page.tsx`: reuse `<BusinessSearch onPick={…}>` → on pick, show the shareable link `${appUrl}/review?placeId=<id>` (note: route is `/review/[placeId]` — either accept `/review?placeId=` via a redirect/route, or generate `/review/<id>`; spec uses `/review?placeId=`, current impl is `/review/[placeId]` — reconcile, e.g. add `app/review/page.tsx` that reads `?placeId` and redirects, OR change QR to path form) + a **downloadable QR** (PNG/SVG) using the installed `qrcode` package (`QRCode.toDataURL(url)` / `toString(url,{type:'svg'})`) — do it in a server action or route handler to keep it off the client bundle. Download button for PNG + SVG.

**D. WS-H — Deploy + tests.** Multi-stage **Dockerfile** (node:22 builder that compiles `better-sqlite3` + `next build`; slim runtime running `node server.js`; COPY `public`, `.next/static`, `./drizzle`, and the standalone output; DB on a volume). **docker-compose.yml** (`web` 1 replica, `dbdata:/data` volume, `DATABASE_URL=file:/data/app.db`, env_file) + **Caddy** service for TLS. Migrations already run on boot via instrumentation (keep the `./drizzle` COPY). **Litestream** or nightly `sqlite3 .backup` to S3 + one restore drill. Add `bun test` unit tests for `lib/resolve.ts` (parseMapsUrl cases: short link, /maps/place, @lat,lng, directions reject, query_place_id), `lib/validations.ts`, and the question-set post-processing. `BACKLOG.md` for out-of-scope. README with run/deploy steps. Ensure `bun run lint` is clean.

## 7. Run / verify
```bash
bun install
bun run db:generate && bun run db:migrate   # if schema changed
bun dev            # http://localhost:3000
bun run typecheck  # must stay green
bun run build      # must stay green
bun test           # once tests exist
```
`.env` needs `GOOGLE_API_KEY` (present) and `ANTHROPIC_API_KEY` (add to test generation). See `.env.example`.

## 8. Working agreement (from CLAUDE.md preamble)
Plan backward from the finished, verified result. Update `PROGRESS.md` as you go and re-read it before big moves. **Verify by running** (typecheck + build + actual flow), not by vibes. Flag uncertainty explicitly. Keep modules small, server-only for DB/secrets, Zod+ownership in every action. Don't reintroduce Supabase/Clerk/Vercel.

## Immediate next steps
1. If `ANTHROPIC_API_KEY` is now set → run **§6.A live smoke-test** first (it may surface prompt/UX tweaks).
2. Build **WS-E** (auth/history) — it unblocks the header nav and history.
3. Build **WS-F** (QR self-serve) — reconcile the `/review?placeId=` vs `/review/[placeId]` entry shape.
4. Build **WS-H** (Docker/Caddy/backups/tests), then a full manual click-through, then deploy.
