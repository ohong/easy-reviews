# Easy Reviews

**Leave a review they'll remember — in under a minute.**

Most people never review the places they love. The blank review box is too much friction, and small businesses are left begging for the feedback that keeps their lights on. Easy Reviews turns a 60-second conversational interview into a polished Google review you post yourself — a quick way to support your favourite local spots without staring down an empty text field.

## The problem it solves

There's a gap between *wanting* to support a business and *actually* writing a review. Easy Reviews closes it:

1. **Entry** — paste a Google Maps URL, or scan a QR code the business hands you (`/review?placeId=…`).
2. **Confirm** — the app resolves the listing and shows a confirmation card so a mis-match is caught before any work.
3. **Interview** — a 4–5 question multiple-choice interview, tailored to the business category and its recent reviews. The first question is always an overall 1–5 rating; the rest branch on it.
4. **Generate** — Claude writes one short review (≈40–80 words) grounded *strictly* in your answers, with tone matched to your rating.
5. **Edit & post** — tweak the text inline or regenerate, then **Copy & open Google** to paste it into Google's review dialog and set your stars.

## Why it isn't fake-review spam

This is **writing assistance, not fabrication** — and that distinction is the product's reason to exist:

- **Grounded** — the review contains only facts you supplied plus the business name and category. No invented dishes, prices, or events.
- **Faithful** — tone always matches the rating you gave. Honest negative and mixed reviews are first-class; this is not a 5★ farm.
- **Human-in-the-loop** — every review is editable, and *you* post it manually through your own Google account. No autoposting, ever.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19), TypeScript strict |
| Database | SQLite via Drizzle ORM (`better-sqlite3`) |
| Auth | Better Auth (Google OAuth), anonymous-first |
| UI | Tailwind CSS v4 + shadcn/ui + Motion (interview stepper) |
| Reviews & questions | Anthropic Claude (Messages API) |
| Business data | Google Places API (New) — resolution, details, autocomplete |
| QR codes | `qrcode` |
| Runtime / tooling | Bun |
| Deploy | Docker (`node:22`) + Caddy, with Litestream for SQLite backup |

Server Components handle reads, Server Actions handle writes, and all secrets + DB access live in a `server-only` data layer (`lib/`). Every input is validated with Zod.

## Development

```bash
bun install                              # install deps
bun run db:generate && bun run db:migrate   # apply Drizzle migrations
bun dev                                  # run dev server at http://localhost:3000

bun test                                 # run the test suite
bun run typecheck                        # tsc --noEmit
bun run lint                             # eslint
```

### Environment

Create a `.env` file. The landing page and `next build` work with no keys; each feature fails loudly with an actionable error if its key is missing.

| Variable | Purpose |
| --- | --- |
| `ANTHROPIC_API_KEY` | Question-set + review generation (required for the core flow) |
| `ANTHROPIC_MODEL` | Defaults to `claude-opus-4-8` |
| `GOOGLE_API_KEY` | Places API (New) — enable for business resolution/details |
| `DATABASE_URL` | Defaults to `file:./data/app.db` |
| `NEXT_PUBLIC_APP_URL` | Public base URL for copy/QR links |
| `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Optional — enables Google login + saved history |

## Project layout

```
app/            Routes: landing, /start, /review, /for-business, /health
  _components/  Page-level UI
components/     Shared shadcn/ui components
lib/            server-only data layer — ai/, db/, services/, places, resolve, env
drizzle/        Migrations
docs/           spec.md (product spec) + design.md (design system)
```

## Scope

MVP is **Google only, web only**: no required accounts, no voice, no photos, no business dashboards, no monetization. It's architected to extend to other platforms (Airbnb, ClassPass) and a voice interview later. See [`docs/spec.md`](docs/spec.md) for the full product spec and [`MVP_GUIDELINES.md`](MVP_GUIDELINES.md) for the build rulebook.
