# MVP Build Guidelines

**Stack:** Next.js 16 (App Router, React 19) — full-stack web app + SQLite (Drizzle) + Tailwind CSS v4
**Deploy:** Single EC2 instance, Docker + Docker Compose
**Team:** 2–3 people
**Timeline:** 2–4 weeks to MVP

This document is the rulebook. Before adding anything, building anything, or arguing about anything — open this file. If a rule here conflicts with what you want to do, the rule wins unless the team agrees in writing to change the rule.

> **Heads up — this is not the Next.js you may remember.** This project runs **Next.js 16** with the App Router and **React 19**. Several things changed from older tutorials and from model training data: `middleware.ts` is now **`proxy.ts`**, request APIs like `cookies()`, `headers()`, `params`, and `searchParams` are now **async** (you `await` them), and the data model is **Server Components for reads, Server Actions for writes, Route Handlers for webhooks/public APIs**. When in doubt, read the guide in `node_modules/next/dist/docs/` before writing code. Don't trust your memory of "how Next.js works."

---

## 1. The One Rule Above All

> **Ship the smallest thing a real user can use end-to-end. Then learn. Then add.**

Every decision below comes from this. If you forget everything else, remember this sentence.

---

## 2. The Mindset

We are not building "the product." We are building **proof that the product is worth building**. That is a fundamentally different job, and it requires a fundamentally different bar.

- **"Good enough" is the goal**, not "great." Great comes after we know users want it.
- **Perfectionism is the enemy of shipping.** If you find yourself polishing something nobody asked for, stop.
- **Boring tech > exciting tech.** Use the most boring, well-documented, stable option every time. (That's exactly why we chose SQLite — see Section 6.)
- **Copy before you create.** If a library, template, or pattern exists, use it. Don't invent.
- **Done > perfect.** A shipped feature with a rough edge beats an unshipped feature with no edges.

---

## 3. The Decision Framework

Before writing any code, ask in order:

1. **Does a user need this to use the product end-to-end?** If no → cut it.
2. **Can we ship without it for the first version?** If yes → cut it.
3. **Will it take more than 1 day to build?** If yes → can we do a 2-hour version instead?
4. **Is there a library that does 80% of this?** If yes → use the library, accept the 80%.
5. **Is this a one-way door?** (Hard to reverse later — database choice, auth strategy, payment provider.) If yes → discuss as a team before deciding. If no → just pick something and move on.

**The 30-minute rule:** If a discussion or decision takes more than 30 minutes, pick the option that's reversible and move on. You're losing more time arguing than you'd lose being wrong.

> **On "one-way doors":** Most of ours aren't as scary as they look. We use an ORM (Drizzle), so switching SQLite → Postgres later is a connection + dialect change, not a rewrite. We keep auth in one library. Pick, ship, revisit when there's real pain.

---

## 4. Scope Rules — What's In, What's Out

### IN scope for MVP

- The one core flow your product exists for (the thing a user signs up to do).
- Auth: sign up, log in, log out. Password reset can wait (and if you use OAuth, you may not need it at all).
- The absolute minimum data persistence to make the core flow work.
- A "settings" page with logout and delete account (you legally need delete).
- Basic error states (`error.tsx` boundaries, "something went wrong, try again") on every route that touches the database or network.

### OUT of scope for MVP (resist hard)

- Onboarding tutorials, tooltips, walkthroughs.
- Dark mode (unless your target users will reject you for not having it). *Note: the scaffold already ships a `prefers-color-scheme` toggle in `globals.css` — leave it, don't expand it.*
- Multi-language / internationalization.
- Real-time / WebSockets / push notifications (unless they ARE the product).
- Payments / subscriptions (unless they ARE the product).
- Admin dashboards. (Query the SQLite file directly with `sqlite3` or a GUI like TablePlus/Beekeeper. SQL is your admin panel.)
- Analytics beyond basic event logging.
- A/B testing infrastructure.
- Caching layers (Redis, etc.). Next.js caches plenty on its own.
- Background jobs / queues (unless your core flow requires async work — and even then, start with a Server Action).
- Microservices, a separate backend service, a separate API gateway. **Next.js is your backend.** One app.
- A hand-rolled design system. Use Tailwind + a component library (see Section 7).
- Animations beyond what you get for free.
- Multiple environments. Production + local. Skip staging for now.

**If someone proposes adding something from the OUT list, the answer is "after MVP."** Write it in `BACKLOG.md` and move on.

---

## 5. Next.js / Frontend Guidelines

### Project setup

- The project is already scaffolded with `create-next-app` (App Router, TypeScript, Tailwind v4, ESLint). **Don't restructure it on day one.**
- Use the installed versions. Don't upgrade Next/React mid-MVP unless something is broken.
- Keep `eslint-config-next` on and fix warnings as you go. Don't accumulate them.
- TypeScript stays in `strict` mode (it already is). The `@/*` path alias points at the project root — use it for imports.

### The mental model (learn this before writing a feature)

This is the part that's different from old Next.js. Three tools, three jobs:

| Need to…                                  | Use                          | Where                                  |
| ----------------------------------------- | ---------------------------- | -------------------------------------- |
| **Read** data and render it               | **Server Component**         | `page.tsx` / `layout.tsx` (default)    |
| **Write/mutate** data from the UI         | **Server Action**            | `'use server'` function                |
| Webhooks, public APIs, client-fetched JSON, non-HTML responses | **Route Handler** | `route.ts`                  |

- **Components are Server Components by default.** They run on the server, can hit the database directly, and ship **zero** JavaScript to the browser. Only add `'use client'` when you need state, effects, event handlers (`onClick`), or browser APIs.
- **Fetch data directly in Server Components** — call your data layer, not your own Route Handlers. (Calling your own API over HTTP from a Server Component adds a round trip and breaks at build time.)
- **Mutate data with Server Actions** (`'use server'`), invoked from a `<form action={...}>` or a button. Show pending/error state with React's `useActionState`.
- **Route Handlers** (`route.ts`) are for things that genuinely need an HTTP endpoint: third-party webhooks, OAuth callbacks, or data fetched by a Client Component (`swr`/`react-query`).

### Folder structure (keep it flat until it hurts)

```
app/
  layout.tsx              # root layout: <html>/<body>, providers, fonts
  page.tsx                # landing page
  globals.css             # @import "tailwindcss";  (already set up)
  (marketing)/            # route group — organizes without changing URLs
    page.tsx
  (auth)/
    login/page.tsx
    signup/page.tsx
  (app)/                  # authenticated area, its own layout
    layout.tsx
    dashboard/page.tsx
    [feature]/
      page.tsx
      _components/         # colocated, NOT routable (underscore = private)
      actions.ts          # 'use server' mutations for this feature
  api/
    webhooks/[provider]/route.ts
lib/
  db/
    index.ts              # Drizzle client (better-sqlite3)
    schema.ts             # tables
    migrations/           # drizzle-kit output
  dal.ts                  # server-only: verifySession(), getUser()
  auth.ts                 # auth library config
  validations.ts          # Zod schemas
components/
  ui/                     # shared presentational components
proxy.ts                  # optimistic redirects (this is the new "middleware")
```

- **Route groups `(name)`** organize routes without affecting the URL. Use them to give the marketing pages and the authenticated app different layouts.
- **Private folders `_name`** are never routable — safe for colocated components, helpers, and feature-local code.
- Do **not** build `domain/`, `data/`, `presentation/` layers or "clean architecture." You have 3 weeks.

### State management

- **Default to the server.** Most "state" is just data you fetch in a Server Component. You will write far less client state than you expect.
- For local UI state (a toggle, a form field, a modal open/close), use `useState` in a Client Component. That's it.
- For the rare bit of shared client state, use React Context. **Do not add Zustand/Redux/Jotai** unless you've actually hit a wall — and you almost certainly won't for an MVP.
- React Context is **not** available in Server Components. Put providers in a `'use client'` component and render them as deep in the tree as possible.

### Async gotchas (these will bite you if you forget)

- `await cookies()`, `await headers()` — these are async now.
- `params` and `searchParams` are Promises: `const { id } = await params`.
- Touching `cookies()`/`headers()`/`searchParams` opts the route into dynamic rendering. That's fine for an MVP; just know it's happening.

### Packages — use them, sparingly

Default to these; they save days:

- `drizzle-orm` + `better-sqlite3` — database (see Section 6).
- `drizzle-kit` — migrations.
- `zod` — input validation, shared between client and server.
- An auth library — **Better Auth** or **Auth.js (NextAuth v5)** (see Section 6). Don't roll your own.
- A component library — **shadcn/ui** (copy-in components, you own the code) or similar (see Section 7).
- `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` — only if users upload files.

Do **not** add a package unless someone is about to write the code it replaces.

### UI rules

- Use Tailwind utility classes for everything. The setup is done (`globals.css` already has `@import "tailwindcss"`). **Tailwind v4 is CSS-first** — theme tokens live in `globals.css` under `@theme`, there is no `tailwind.config.js`. Don't create one.
- Pull in pre-built components (shadcn/ui) instead of hand-building buttons, inputs, dialogs.
- Use `next/image` for images and `next/font` for fonts — both are automatic optimizations you get for free.
- **No custom design system in the first week.** If you're writing a bespoke component, ask: can I use a library component with different props?
- Spacing: stick to Tailwind's scale (`p-1 p-2 p-4 p-6 p-8`...). Don't invent arbitrary values.
- Loading states: a `loading.tsx` file or a simple spinner. Don't build skeleton screens.
- Empty states: a centered icon + one line of text. Don't design illustrations.

### Testing

- The framework guides are in `node_modules/next/dist/docs/01-app/02-guides/testing/` (Vitest, Jest, Playwright, Cypress).
- Write tests for: your **data layer** (the functions that talk to SQLite) and any **non-trivial business logic** (Zod schemas, pricing, permissions).
- **`async` Server Components don't unit-test well yet** — the official guidance is to cover those with **end-to-end tests (Playwright)** instead.
- Skip: snapshot tests, exhaustive component tests. Not now.
- Smoke test manually before each merge: click through the core flow on the deployed preview.

---

## 6. Backend & Database — Next.js *is* the backend

There is no separate backend service. Your "backend" is Server Actions, Route Handlers, and a `server-only` data layer, all in this one app.

### Database: SQLite + Drizzle

We use **SQLite**, accessed through **Drizzle ORM** with the **`better-sqlite3`** driver. This is the simplest thing that works, and — because we deploy to a persistent EC2 box with a Docker volume (Section 9) — it works great.

- **Define a Drizzle schema for every table** in `lib/db/schema.ts`. The schema is your source of truth and your documentation.
- **Migrations are free — use them.** `drizzle-kit generate` writes a migration from your schema changes; `drizzle-kit migrate` applies it. Run migrations on app startup or as a deploy step. Don't hand-edit the database.
- **Set these pragmas once** when you open the connection, or you *will* hit "database is locked" under concurrent requests:
  ```
  PRAGMA journal_mode = WAL;     -- readers don't block the writer
  PRAGMA busy_timeout = 5000;    -- wait instead of erroring on a locked DB
  PRAGMA synchronous = NORMAL;   -- safe with WAL, much faster
  PRAGMA foreign_keys = ON;      -- enforce relations (off by default in SQLite!)
  ```
- **Timestamps:** add `createdAt` / `updatedAt` columns to every table (Drizzle has helpers). Cheap, always useful.
- **Soft deletes:** add a `deletedAt` column and filter it out by default. Hard deletes are scary.
- **Index what you query.** Add an index for every column you filter, sort, or join on. SQLite is fast, but only with indexes.
- **One writer.** SQLite (with WAL) handles many concurrent readers + one writer — plenty for an MVP on one box. The hard limit is *multiple servers* with their own copy of the file. We run one EC2 instance, so we're fine. **The day we need to load-balance across multiple instances is the day we add a `postgres` service to the compose file** — and thanks to Drizzle, that's a small change, not a rewrite.

> **Why not Postgres?** Because we wanted simplicity and we're on a single persistent host. SQLite means zero extra services, one file to back up, and no connection-pool tuning. The serverless "you can't write to the filesystem" problem **does not apply to us** — we're on EC2 with a Docker volume. Keep it until you genuinely outgrow it.

### The data layer (DAL) — non-negotiable structure

Centralize all database access and authorization in a **`server-only`** module. This is the single most important security pattern in App Router.

- Mark `lib/dal.ts` (and `lib/db/*`) with `import 'server-only'` at the top. This makes the build fail if database code is ever pulled into the client bundle.
- Put a `verifySession()` (and `getUser()`) helper here, wrapped in React's `cache()` so repeated calls in one request hit the DB once.
- **Only the data layer reads `process.env` secrets.** Keep secrets out of the rest of the app.
- **Return DTOs, not raw rows.** Select only the columns the UI needs. Never pass a whole user record (with password hash, internal flags, etc.) to a Client Component.

### Non-negotiables (cheap, and they prevent disasters)

- **Validate every input with Zod** inside the Server Action or Route Handler. Form data, params, search params, and headers are all attacker-controlled. Client-side validation is UX, not security.
- **Verify auth AND authorization inside every Server Action and Route Handler.** This is critical and easy to forget:
  - A Server Action is reachable by a **direct POST request**, not just through your form. A page-level auth check does **not** protect the actions on that page.
  - Check authentication (is the user logged in?) *and* authorization (does this user own *this specific* record?). Skipping the ownership check is the #1 MVP security bug (IDOR).
  ```ts
  'use server'
  export async function deletePost(postId: string) {
    const session = await verifySession()        // authenticated?
    const post = await getPost(postId)
    if (post.authorId !== session.userId) throw new Error('Forbidden')  // authorized?
    await db.delete(posts).where(eq(posts.id, postId))
    revalidatePath('/posts')
  }
  ```
- **After a mutation, refresh the UI:** `revalidatePath()` / `revalidateTag()` from `next/cache`, or `redirect()` from `next/navigation`. Don't leave stale data on screen.
- **Global error handling:** add `app/error.tsx` (and `app/global-error.tsx`) for the UI; return consistent JSON + status codes from Route Handlers. Set this up early. Never leak internal error details to the client.
- **Environment variables** live in `.env` (already gitignored). Validate them with Zod at startup so a missing variable fails loudly. **Only variables prefixed `NEXT_PUBLIC_` reach the browser** — never put a secret behind that prefix.
- **Rate-limit expensive actions** (sending email, file processing). A small in-memory or DB-backed limiter is fine for one box.

### Auth — pick one library, store users in SQLite

We keep identity in our own database (it's the whole point of choosing SQLite). Use a library — never hand-roll sessions or password hashing.

- **Primary: Better Auth.** TypeScript-native, first-class Drizzle + SQLite support, built-in session management, OAuth + email/password out of the box, easy delete-account. Simplest path for this stack.
- **Alternative: Auth.js (NextAuth v5)** with the Drizzle adapter — more widely known, equally valid.
- **Prefer OAuth (Google / GitHub).** If you only do social login, **you store zero passwords** — fewer ways to get breached, no reset flow to build.
- **If you do email + password,** use the library's hashing (argon2 / bcrypt). **Never store plaintext, never roll your own crypto.**
- **Two roles max** for MVP: regular user and (if needed) admin. A boolean `isAdmin` column is fine. Don't build a permissions system.
- **`proxy.ts` does optimistic redirects only.** It runs on every request (cheap), so it reads the session cookie and redirects unauthenticated users away from protected routes. It is **not** your security boundary — the real checks live in the data layer and Server Actions. (Reminder: in Next.js 16 this file is `proxy.ts`, not `middleware.ts`.)

### File uploads (only if your core flow needs them)

- **The browser never gets AWS credentials.** The server generates an **S3 presigned URL**; the browser uploads directly to that URL; you store the returned object key in SQLite.
- Validate file size and content type on the server **before** issuing the presigned URL.
- Block all public access on the bucket; use presigned URLs for downloads too if files are private.
- Create one IAM user scoped to *only* that bucket. No wildcards, no `AdministratorAccess`, ever. Keys go in `.env`.
- *(For a true MVP on one box, you could also store uploads on the same Docker volume as the DB. S3 is cleaner and the recommended path, but don't over-build if you have a handful of files.)*

### What we are NOT building

- No Redis, no message queues, no Elasticsearch, no separate workers (unless the core flow truly needs async).
- No GraphQL, no tRPC layer, no separate API service. Server Actions + Route Handlers are the API.
- No microservices. One app, one database file, one container.

---

## 7. Design Guidelines

You are not designers. That's fine. Follow these and the app will look professional enough.

- **Tailwind utilities + a component library (shadcn/ui).** Don't hand-build common components.
- **Pick one primary color** and define it as a theme token in `globals.css` under `@theme`. Done.
- **Typography:** use the default font (the scaffold wires up `next/font`). Don't customize.
- **Spacing:** stick to Tailwind's spacing scale. No arbitrary `[13px]` values.
- **One primary CTA per screen.** Two equally-loud buttons is a design problem, not a button problem.
- **Forms:** label above the field, error below. That's it. Drive errors from your Zod schema via `useActionState`.
- **Icons:** use a free set (lucide-react ships with shadcn/ui). Don't buy a custom icon set.
- **Every list needs an empty state.** "No items yet. Add your first." is enough.

**The smell test:** open the app in a browser. Does it look like a normal web app a normal person would use? Yes → ship it. No → fix the one specific thing that looks broken, not everything.

---

## 8. Quality Bar — Where We Do NOT Cut Corners

Speed is not an excuse for these. Everything else is negotiable; these are not:

1. **No secrets in git.** `.env` is gitignored from commit one. Never put a secret behind `NEXT_PUBLIC_` (that ships it to the browser). If a key leaks, rotate it the same day.
2. **HTTPS everywhere** in production. Terminate TLS at the reverse proxy (Section 9).
3. **No plaintext passwords.** Prefer OAuth and store none. If you do passwords, they're hashed by the auth library (argon2/bcrypt). No hand-rolled auth.
4. **No cloud credentials in the browser.** S3 uploads go through server-generated presigned URLs. If you're about to put an AWS key in client code, stop.
5. **Validate and authorize inside every Server Action and Route Handler.** Every one. They are public POST endpoints. Page-level checks don't protect them.
6. **No data-loss bugs.** This is the one to watch with SQLite:
   - The DB file **must** live on the Docker **volume**, never inside the container image. A redeploy or `docker compose up --build` recreates the container — if the file was in the container, it's **gone**.
   - **Never run `docker compose down -v`** in production — `-v` deletes the volume (your whole database).
   - Backups must be running (Section 9). If a user creates something and it disappears, that's a P0 — drop everything.
7. **The core flow always works.** If signup, login, or the one main feature is broken, nothing else ships until it's fixed.
8. **The app does not crash on the happy path.** A crash on a normal user action is a P0. Wrap routes in `error.tsx` boundaries.
9. **Backups are running and tested.** The database is a single file — use **Litestream** (streams it to S3 continuously) or a nightly `sqlite3 .backup` to S3. **Do one restore drill before launch.** Don't assume.
10. **Privacy basics:** a real privacy policy page, a delete-account flow that *actually* deletes the user and their rows (and revokes their sessions / OAuth link), and don't collect data you don't need.

---

## 9. Deploy — EC2 + Docker Compose

One instance, one app container, one persistent volume. Keep it that simple.

### Build a small image with `output: 'standalone'`

Set `output: 'standalone'` in `next.config.ts` so the Docker image ships only the files it needs. Use a multi-stage Dockerfile: a full `node:22` builder stage (needed to compile the native `better-sqlite3` module), then a slim runtime stage.

### Compose: keep the database on a volume

```yaml
# docker-compose.yml
services:
  web:
    build: .
    restart: always
    ports: ["3000:3000"]
    env_file: .env
    environment:
      DATABASE_URL: file:/data/app.db        # DB lives in the volume, not the image
    volumes:
      - dbdata:/data
volumes:
  dbdata:
```

- The SQLite file lives in the **`dbdata`** named volume, so it survives `docker compose down`, `up`, rebuilds, and redeploys.
- **`docker compose down` is safe. `docker compose down -v` deletes your database.** Burn that into everyone's memory.
- Run migrations on container start (an entrypoint that runs `drizzle-kit migrate` before `node server.js`).
- Keep it to **one `web` replica.** SQLite is single-writer; don't scale the service to N replicas.

### TLS / reverse proxy

Put **nginx** or **Caddy** in front of the app (a second compose service) to terminate HTTPS and handle malformed/slow requests. Don't expose `next start` directly to the internet. Caddy gets you automatic Let's Encrypt certs with almost no config.

### Backups (do this before launch)

- **Litestream** as a sidecar: continuously replicates the SQLite file to S3. Restore with `litestream restore`. This is the boring, correct answer.
- Or a nightly cron: `sqlite3 /data/app.db ".backup '/tmp/backup.db'"` → upload to S3. (Don't just `cp` a WAL-mode file mid-write — use `.backup`.)
- EBS snapshots of the volume are a coarse backstop, not a substitute.
- **A backup you haven't restored is a hope, not a backup.** Test one restore.

### EC2 notes

- Keep the Docker volume on a persistent **EBS** volume. Instance store is ephemeral — don't put the DB there.
- The DB survives reboots. It does **not** survive instance *termination* unless it's on a separate EBS volume you re-attach. For an MVP, just don't casually terminate the instance, and rely on your S3 backups.
- `git push` → on the box: `git pull && docker compose up -d --build`. That's the whole deploy. No Kubernetes, no CI/CD pipeline beyond this.

### Environments

- **Production + local only.** Skip staging. It costs time to maintain and you don't need it yet.

---

## 10. Process — How the Team Works

With 2–3 people you don't need ceremony. You need clarity.

### Daily

- 10-minute stand-up (text channel is fine). Each person: what I did, what I'm doing, what's blocking me.
- One person is on "shipping duty" for the day — they handle merges, the deploy, and unblocking others.

### Git

- **One repo.** It's one app (frontend + backend together) — there is nothing to split.
- `main` is always deployable.
- Short-lived feature branches: `feature/login`, `fix/profile-crash`. Merge within 2 days max.
- **One reviewer** required per PR. Anyone but the author can approve.
- Squash merge. Clean history matters when you're debugging at midnight.

### Issue tracking

- GitHub Issues or Linear. Pick one in the first hour and never look back.
- Three labels max: `bug`, `feature`, `chore`.
- A `BACKLOG.md` for "after MVP" ideas keeps them off the active board.

### Deploy

- `git pull && docker compose up -d --build` on the EC2 box. Don't build a pipeline beyond that yet.

### Definition of done

A task is done when:
1. The code is merged to `main`.
2. The feature has been manually tested on the deployed app by someone other than the author.
3. It's deployed to production.
4. If it changed a shared contract (a Server Action signature, a Route Handler, the DB schema), the team has been told.

Not "done" means it's not done. Don't mark tickets done because they're "almost there."

---

## 11. The Anti-Patterns — Things We Will Catch Ourselves Doing

Watch for these. Call them out kindly — and accept being called out yourself.

- **"While I'm in there..."** — refactoring unrelated code in a PR. Separate ticket. Move on.
- **"Let's just add Redis / Postgres / a queue real quick."** — no. Re-read Section 6.
- **"This will scale better if we..."** — you have zero users. Optimize for zero users.
- **"Let me make everything a Client Component."** — no. Server Components are the default; add `'use client'` only where you need interactivity.
- **"I'll just skip the auth check in the action, the page already checks."** — that's a security hole. Every Server Action re-verifies. Always.
- **"We should write tests for everything."** — see Section 5 testing rules.
- **"Let me set up proper architecture first."** — ship the feature. Refactor at a real pain point.
- **"I'll just make this pixel-perfect."** — does the user notice? If you have to ask, no.
- **Bikeshedding on naming or folder structure** for more than 5 minutes. Pick one. Move.

---

## 12. The Pre-Build Checklist

Before you start building anything new, run through this:

- [ ] Is this required for a user to complete the core flow end-to-end? If no, **stop**.
- [ ] Have I checked if a library already does this?
- [ ] Can I build a 2-hour version that's 80% as good?
- [ ] Is there an existing pattern in our codebase I should follow?
- [ ] Does this read data (Server Component), write data (Server Action), or need a real HTTP endpoint (Route Handler)? Pick the right one.
- [ ] Will it change the database schema? If yes, have I written a Drizzle migration and told the team?
- [ ] Does any new code that touches the DB live in the `server-only` data layer, with auth + authorization checks?
- [ ] Does it fit within today? If not, can I split it?

If all clear → build it. If anything is unclear → ask the team for 5 minutes before you start. Five minutes of alignment saves five hours of rework.

---

## 13. After MVP

When the MVP ships and you have real users:

1. **Watch them use it.** Talk to them. The next two weeks of work come from what they tell you, not from this backlog.
2. **Then** revisit the OUT list in Section 4. Add things back only if real user behavior justifies them.
3. **Then** revisit the big decisions. The most likely first graduation is **SQLite → Postgres**, the day you need more than one app server. Because everything goes through Drizzle and the data layer, that's a contained change — not a rewrite.

Most of the things you'll be tempted to add right now will turn out not to matter. That's the whole point of an MVP.

---

## Appendix: The Single Most Important Habit

When you're about to build something, pause and ask:

> **"What is the smallest thing I can build that will let a user do this?"**

Build that. Ship it. Then ask the question again.

That's the whole methodology.
