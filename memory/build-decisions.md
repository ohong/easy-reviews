---
name: build-decisions
description: Locked stack/scope decisions for the easy-reviews build (overrides spec where they conflict)
metadata:
  type: project
---

Building `docs/spec.md` ("Easy Google Reviews") under the rules in `MVP_GUIDELINES.md`. Where the two conflict, the MVP guidelines win. Four decisions locked with the user on 2026-06-13:

1. **Stack:** Follow MVP guidelines, NOT the spec's infra. Use Next.js (latest, App Router, React 19) + SQLite/Drizzle (`better-sqlite3`) + Better Auth + Tailwind v4 + shadcn/ui, deployed via Docker Compose + Caddy on EC2. The spec's Supabase/Postgres+RLS/Clerk/Vercel are explicitly overridden.
2. **API keys:** Build for LIVE Google Places API (New) + Anthropic Messages API. User supplies `ANTHROPIC_API_KEY` + `GOOGLE_MAPS_API_KEY` in `.env`. Validate env with Zod at startup (fail loudly).
3. **Auth:** Anonymous-first — core review flow needs NO login (`session_id` in localStorage). Better Auth Google OAuth + "your spots" history is a secondary layer.
4. **QR self-serve (FR-6):** In scope this round — business self-search (Places Autocomplete) -> `/review?placeId=` link + downloadable QR.

Package manager is Bun (per repo CLAUDE.md "use Bun for all JS/TS tooling"); Docker runtime target is node:22 (native `better-sqlite3`). See [[easy-reviews-architecture]].
