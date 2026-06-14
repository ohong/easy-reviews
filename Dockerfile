# syntax=docker/dockerfile:1

# ── Builder: compile the native better-sqlite3 addon + emit the standalone server ──
FROM node:22-bookworm-slim AS builder
WORKDIR /app

# Toolchain for compiling better-sqlite3's native addon (falls back from a
# prebuilt), plus curl + unzip for the bun installer below.
RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 make g++ ca-certificates curl unzip \
    && rm -rf /var/lib/apt/lists/*

# Bun is the project's package manager (honors bun.lock); the runtime stays Node.
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

# Install deps first (cached unless the lockfile changes).
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# The runtime is `node server.js`, not bun. Recompile the native SQLite addon
# against THIS image's Node ABI so the .node binary is guaranteed to load under
# node:22 (a bun-installed prebuilt can target a different ABI → boot crash).
RUN npm rebuild better-sqlite3 --build-from-source

# Build the app. Core API keys are NOT needed at build time (env.ts makes them
# optional at boot); they're injected at runtime via compose env_file.
COPY . .
# NEXT_PUBLIC_* values are inlined into the client bundle at build time, so the
# public app URL must be known HERE — it drives the "copy review" + QR deep
# links. Override per environment:
#   docker build --build-arg NEXT_PUBLIC_APP_URL=https://reviews.bakeoff.app .
ARG NEXT_PUBLIC_APP_URL=https://reviews.bakeoff.app
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

# ── Runtime: minimal Node server, no toolchain, non-root ──
FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# SQLite DB lives on a mounted volume (compose sets DATABASE_URL=file:/data/app.db).
RUN mkdir -p /data && chown -R node:node /data

# Next's standalone output already traces the needed node_modules (including the
# compiled better-sqlite3 binary). public/ and .next/static are NOT in standalone
# and must be copied alongside; drizzle/ holds the migrations applied on boot.
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/drizzle ./drizzle
# Belt-and-suspenders: guarantee the from-source-compiled native SQLite driver
# is present in the standalone node_modules even if file-tracing dropped it.
COPY --from=builder --chown=node:node /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3

USER node
EXPOSE 3000
# instrumentation.ts applies pending migrations against /data/app.db on startup.
CMD ["node", "server.js"]
