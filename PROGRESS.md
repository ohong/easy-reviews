# PROGRESS — Easy Google Reviews build

**End state (one sentence):** a working Next.js 16 app where a user pastes a Google Maps URL (or scans a QR), confirms the business, answers a <60s interview, gets an honest grounded review, and copies it into Google — plus optional Google login/history and a business QR generator — deployed at `https://reviews.bakeoff.app` via a prebuilt ARM64 Docker image (ECR) behind the shared EC2 nginx proxy.

**Stack (locked):** Next 16 + SQLite/Drizzle + Better Auth + Tailwind v4/shadcn(Base UI) + `motion`; Anthropic (forced tool-use) + Google Places (New). Live key present: `GOOGLE_API_KEY`. **Missing: `ANTHROPIC_API_KEY`** (user to add; build proceeds, generation untested live until then).

## Checkpoints (verify = checked, not vibes)

- [x] **Scaffold** — Next 16.2.9/React 19/TW4 installed; merged into repo. ✔ build tooling runs.
- [x] **Config & env** — `next.config` (standalone + native external + drizzle tracing), `lib/env.ts` (Zod, feature flags), `.env.example`, shadcn init. ✔ typecheck.
- [x] **DB layer** — `lib/db/schema.ts` (businesses, reviews, auth tables), connection w/ pragmas, drizzle config, `instrumentation.ts` auto-migrate. ✔ migration applied, 6 tables created.
- [x] **AI core (WS-B)** — `lib/places.ts` (search/details/autocomplete/summary), `lib/anthropic.ts`, `lib/ai/*` (summary, question-set, review gen via forced tool-use + Zod), `lib/services/interview.ts` (cache). ✔ Places verified LIVE; ✔ typecheck.
- [x] **Entry & resolution (WS-A)** — `lib/resolve.ts` (URL parser + resolver), `app/actions.ts` (`resolveUrlAction`), landing `PasteForm`, `/start` manual search (autocomplete), `confirm-card`, QR route = `/review/[placeId]`. ✔ build.
- [x] **Interview UI (WS-C)** — `_components/interview.tsx`: stepper, rating gate w/ auto-advance, single/multi chips, optional free-text, progress, `motion` slide. ✔ build.
- [x] **Result & handoff (WS-D)** — `_components/result.tsx`: editable textarea, regenerate, suggested stars, copy+deeplink, posted flag; `lib/services/reviews.ts` (ownership-checked). ✔ build.
- [x] **Design shell & landing (WS-G)** — layout (Geist+Fraunces fonts, Toaster, metadata), warm editorial tokens, header/footer, landing copy, error/global-error/loading/not-found. ✔ build. (Header auth nav lands with WS-E.)
- [ ] **Accounts & history (WS-E)** — Better Auth (Google), anon session, history, settings(delete), `proxy.ts`, claim-on-signup. Wire `lib/auth-session.ts` stub to real session.
- [x] **QR self-serve (WS-F)** — `/for-business` rebuilt: `BusinessQrStudio` reuses `BusinessSearch` w/ `onPick` → `generateQrAction` (server-side `qrcode`, PNG+SVG) → shareable `${appUrl}/review?placeId=` link (copy) + downloadable QR (PNG/SVG) + preview link. `proxy.ts` middleware normalizes `/review?placeId=` → `/review/[placeId]` (real 307; QR=no confirm, pasted=confirm=1); `app/review/page.tsx` is a JS-browser fallback. Fixed Base UI `nativeButton` a11y warning on all `<Button render={<Link/a>}>`. ✔ typecheck; ✔ 307 redirects verified live; ✔ qrcode output valid. (QR studio click-through → final browser pass.)
- [~] **Deploy & tests (WS-H)** — **DEPLOYED LIVE ✅ at https://reviews.bakeoff.app** (2026-06-13, tag `ce5f8d7`; HTTPS 200, valid LE cert, egress to Anthropic+Google confirmed). **Still TODO:** click through interview→generate in the browser on prod, enable backup cron + restore drill before real launch, unit tests (resolver, schemas), BACKLOG.md, green lint. See "WS-H Deploy infra" below.

## WS-E DEFERRED (user de-scoped 2026-06-13)
User chose "skip accounts for now" — anonymous consumer flow IS the product (no OAuth creds available). `lib/auth-session.ts` stays stubbed (returns null → anonymous via localStorage `session_id`). Moved to BACKLOG.md. Build order chosen: testable-first (WS-F → WS-H).

## Live-verified via shared dev server (2026-06-13, port 3100)
Full interactive consumer flow confirmed in browser (dev log): resolveUrlAction → prepareInterviewAction (AI, 9.6s) → generateReviewAction (4★, grounded review) → saveFinalTextAction → markPostedAction, all 200. Reviews-service CRUD + DB persistence work live.

## Verified milestone (2026-06-13)
Consumer happy-path complete and **`bun run build` passes** (routes: `/` ○, `/for-business` ○, `/review/[placeId]` ƒ, `/start` ƒ). Places API verified live. Typecheck green. Generation paths NOT yet smoke-tested live (needs `ANTHROPIC_API_KEY`).

## §6.A LIVE SMOKE — DONE ✅ (2026-06-13, ANTHROPIC_API_KEY now set)
- `bun run smoke:ai` exercises live Places + Anthropic end-to-end: resolve → reviews → summary → question set → review for 5★ + 2★ + regenerate. All integrity checks pass (grounded, sentiment-faithful, ~40-80w, no clichés).
- **BUG FOUND + FIXED:** `emit_summary` had 2 top-level props (summary+themes) → claude-opus-4-8 leaked `</parameter>` markup into `summary` and returned `themes:[]`. Collapsed to a single `note` object property (the pattern the clean single-prop tools use). Verified: summary clean, themes populated. Saved to memory.
- Dev server boots (Turbopack), `instrumentation.ts` auto-migrates on boot → `data/app.db` has all 6 tables + `__drizzle_migrations` (1 applied). SSR routes `/`, `/start`, `/for-business` = 200; `/review/[placeId]?confirm=1` SSR-resolves a live business. Added `@types/bun` (devDep) so smoke/test files typecheck; typecheck green.
- TODO in final click-through: interactive interview→generate→persist→copy + reviews-service CRUD (can't run under Bun; needs Node/browser). Minor: Base UI `nativeButton` a11y warning on header `<Button render={<Link/>}>` — fix during WS-E header work.

## WS-H Deploy infra — DONE (2026-06-13), not yet deployed
Built deploy-as-code so go-live is a single command later (app still changing, so not deployed yet).
- **Target:** EC2 `i-0fd85db46ec5ce6e3` (Amazon Linux 2023, **ARM64/Graviton t4g.large**, EIP `50.17.25.115`), shared multi-app host documented at `/opt/apps/readme.md` (reached via SSM).
- **KEY DISCOVERY — it's nginx + ECR, NOT Caddy/build-on-box** (MVP_GUIDELINES assumed Caddy + `git pull && compose build`). The real box: each app is its own compose stack pulling a **prebuilt image from ECR** (`apps/<name>`); a shared **nginx** proxy stack (`/opt/apps/proxy`) terminates TLS via **certbot/Let's Encrypt** and routes over the `proxy-net` network. Mirrored the two Next.js precedents on the box (`job-posting-web`, `carrier-helper-web`): SQLite-on-volume + `read_only`/`cap_drop ALL`/`no-new-privileges` hardening.
- **Files:** `Dockerfile` (multi-stage arm64; a teammate drafted it 16:37 — I added 3 fixes: `NEXT_PUBLIC_APP_URL` build-arg [else QR/copy links bake `localhost`], `npm rebuild better-sqlite3 --build-from-source` [Node-ABI safety vs bun prebuilds], explicit better-sqlite3 copy into runner), `.dockerignore`, `app/health/route.ts` (GET /health probe), `deploy/docker-compose.yml`, `deploy/env.example`, `deploy/nginx/reviews.bakeoff.app.conf`, `deploy/scripts/build-and-push.sh` + `backup.sh`, `DEPLOY.md` (runbook).
- **Deliberate deviation:** app is on `proxy-net` ONLY (not an `internal:true` net like the twins) because the core flow needs outbound HTTPS to Anthropic + Google. Documented in compose.
- **Done on AWS:** ECR repo `apps/reviews` created (empty) + lifecycle policy. DNS confirmed (A→EIP, no Cloudflare); SG 80/443 already open.
- **Verified (not vibes):** `bun run typecheck` clean; `docker compose config` resolves; `nginx -t` passes (self-signed cert + `api` zone wrapper); **local `docker build --platform linux/arm64` succeeds** (caught + fixed a missing `unzip` for the bun installer); **and the image BOOTS under full prod hardening** (`--read-only --cap-drop ALL --no-new-privileges` + tmpfs + `/data` volume): `/health`→200, `/`→200, native better-sqlite3 loads, migrations apply on boot (7 tables, 1 migration), DB writes to the `node`-owned volume. Test artifacts cleaned up; ECR still empty.
- **LEFT to go live (in DEPLOY.md):** build+push image → stage `/opt/apps/reviews` (compose+`.env`) → `compose up` → certbot cert → enable nginx vhost + reload → verify. Backups: enable the cron + do one restore drill **before real launch** (MVP §8/§9). Also still owed for WS-H: unit tests + BACKLOG.md + lint.

## WS-H Deploy — EXECUTED LIVE (2026-06-13) ✅
Deployed end-to-end at **https://reviews.bakeoff.app** (image tag `ce5f8d7`, digest `sha256:0e2863…`). All 6 steps from DEPLOY.md done + verified: built/pushed arm64 image to ECR → staged `/opt/apps/reviews` (compose + chmod-600 `.env`, secrets via base64 so they never hit the transcript) → `compose pull && up -d` (healthy) → confirmed egress (Anthropic 401, Google 403 = reachable) → issued LE cert → enabled nginx vhost (`nginx -t` ok, reloaded). Public checks: HTTPS `/health`→200, `/`→200, HTTP→HTTPS 301, valid LE cert (→2026-09-11).
- **2 gotchas hit + fixed (saved to memory `easy-reviews-deploy`):** (1) backgrounded Bash runs under **zsh** → `$IMG:ce5f8d7`/`$IMG:latest` were eaten by zsh's `:c`/`:l` parameter modifiers, mangling the push refs — brace expansions or literals required. (2) the proxy `certbot` service has a renew-loop **entrypoint**, so `compose run certbot certonly …` hangs in `sleep 12h` — must pass `--entrypoint certbot` (DEPLOY.md §3d fixed).
- **NOT yet done on prod:** browser click-through of interview→generate→copy (egress proven, but the AI flow itself not exercised on prod); backup cron + restore drill (do before real launch).

## Design system pass (2026-06-13) — applying `design/` mockups
**End state:** every surface matches the warm, editorial, retro-botanical mockups in `design/` (olive-green brand on cream paper, Fraunces serif headlines, sage/terracotta/gold botanical accents, soft rounded cards).
- **Palette extracted from mockups** (ImageMagick sampling → OKLCH, in `app/globals.css`): paper `oklch(0.977 0.010 87.5)`, ink deep-olive, **primary olive `oklch(0.469 0.087 111.8)`** (was terracotta), accents sage/terracotta/gold/wheat. New tokens wired in `@theme inline` → utilities `bg-paper/sage/sage-tint/terracotta/gold/wheat`, `text-/fill-/border-*`, `bg-primary-hover`, `shadow-soft/card/lift`. `--radius` → 0.8rem.
- **New components:** `components/brand/logo-mark.tsx` (olive aster), `components/decoration/botanicals.tsx` (Sunflower/TerracottaBloom/Leaf/LeafSprig SVGs + `PageBotanicals` global backdrop, geometry verified via sharp), `components/ui/stepper.tsx` (Find→Answer→Review→Post).
- **Restyled primitives:** button (olive + `sage` variant, rounded-xl), card (rounded-2xl + shadow-card), badge (+ sage/terracotta/gold/wheat pills), input/textarea (cream rounded-xl), star-rating (gold), progress (olive on wheat), skeleton.
- **Restyled surfaces:** layout (botanical backdrop), site-header (logo + serif wordmark), footer, landing `page.tsx` + paste-form (screenshot-verified vs `web-landing.png`), error/loading/not-found/global-error. Review flow + start/for-business delegated to subagents on disjoint files.
- **Constraint honored:** presentation-only — no logic/props/server-action/auth/deploy changes. Live screenshot check on dev `:3001`.

## Open questions / risks
- ANTHROPIC_API_KEY not yet provided → generation paths can't be smoke-tested live yet (code verified by typecheck + structure).
- shadcn v4 uses **Base UI** (`render` prop), not Radix — components differ from older muscle memory.
- `output: standalone` + better-sqlite3 native: Dockerfile must rebuild for target platform & copy `public/.next/static/drizzle`.

_Update this file at each checkpoint. Re-read before major actions._
