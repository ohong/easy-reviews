# Deploying easy-reviews

Production target: **`https://reviews.bakeoff.app`** on the shared EC2 host
`i-0fd85db46ec5ce6e3` (Amazon Linux 2023, **ARM64 / Graviton**, public IP
`50.17.25.115`). The host's conventions are documented on the box at
`/opt/apps/readme.md` — this file is the easy-reviews-specific runbook on top of it.

> **Status:** ✅ DEPLOYED and live at https://reviews.bakeoff.app (first deploy
> 2026-06-13, image tag `ce5f8d7`). For subsequent updates use **§4 Routine
> deploy**. §3 documents the first-time setup (already done).
> **Before real launch:** enable backups (§6) + do one restore drill.

---

## 1. How it works (architecture)

```
Browser → reviews.bakeoff.app (A → 50.17.25.115)
        → nginx (proxy stack, ports 80/443, Let's Encrypt TLS)
        → reviews container (Next.js standalone, :3000, on proxy-net)
        → SQLite file on the `reviews_data` Docker volume (/data/app.db)
        ↘ outbound HTTPS → Anthropic + Google Places
```

- The image is **prebuilt for `linux/arm64`** and pushed to **ECR** (`apps/reviews`);
  the box pulls it. There is **no build on the box**.
- One app container. SQLite lives on a **named volume** (`reviews_data`), never in
  the image — it survives redeploys, rebuilds, and reboots.
- Migrations apply automatically on boot (`instrumentation.ts`). No migrate step.
- The container is hardened per the box standard: `read_only` root FS, `cap_drop:
  ALL`, `no-new-privileges`, tmpfs for `/tmp` + `/app/.next/cache`, resource limits.
- It is on **`proxy-net` only** (not an `internal: true` net) because the core
  flow needs outbound HTTPS to Anthropic + Google.

### Files in this repo
| Path | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage arm64 build → Next standalone runtime |
| `.dockerignore` | Keep the build context lean / secrets out |
| `app/health/route.ts` | `GET /health` liveness probe for the healthcheck |
| `deploy/docker-compose.yml` | The box stack (→ `/opt/apps/reviews/docker-compose.yml`) |
| `deploy/env.example` | Env template (→ `/opt/apps/reviews/.env`, chmod 600) |
| `deploy/nginx/reviews.bakeoff.app.conf` | nginx vhost (→ `/opt/apps/proxy/conf.d/`) |
| `deploy/scripts/build-and-push.sh` | Build arm64 + push to ECR (run locally) |
| `deploy/scripts/backup.sh` | Nightly SQLite → S3 (runs on the box) |

---

## 2. Prerequisites (already true)

- ✅ **DNS:** `reviews.bakeoff.app` A → `50.17.25.115` (direct, no Cloudflare).
- ✅ **Security group:** ports 80 + 443 already open (`sg-0543df7476ca0ef54`).
- ✅ **ECR repo:** `apps/reviews` created (empty). Instance role has ECR read.
- ✅ **Box tooling:** Docker 29 + Compose v5, nginx proxy stack already running,
  `proxy-net` network exists.

You connect to the box with SSM:
```bash
aws ssm start-session --target i-0fd85db46ec5ce6e3
sudo -i        # the app dirs under /opt/apps are root/deploy-owned
```
(Or run one-off commands with `aws ssm send-command --document-name AWS-RunShellScript`.)

---

## 3. First-time deploy

### 3a. Build & push the image (from your machine)
```bash
# Apple Silicon builds arm64 natively; on amd64 buildx emulates (slower).
./deploy/scripts/build-and-push.sh            # tags :<git-sha> and :latest
# → prints the tag to use below
```

### 3b. Stage the app dir on the box
```bash
sudo install -d -o root -g deploy /opt/apps/reviews
# Copy deploy/docker-compose.yml → /opt/apps/reviews/docker-compose.yml
# Copy deploy/env.example        → /opt/apps/reviews/.env   (then edit + chmod 600)
sudo nano /opt/apps/reviews/.env      # set ANTHROPIC_API_KEY, GOOGLE_API_KEY, TAG=<git-sha>
sudo chmod 600 /opt/apps/reviews/.env
```
> Get the files onto the box however you like: paste via the SSM shell, or
> `aws ssm send-command` writing the file, or `aws s3 cp` through a bucket.

### 3c. Start the container (no TLS yet)
```bash
cd /opt/apps/reviews
/opt/apps/scripts/ecr-login.sh
docker compose pull
docker compose up -d
docker compose ps                     # healthy?
docker compose logs -f                # watch migrations apply on boot
```
Smoke-test it on the internal network before exposing it:
```bash
docker run --rm --network proxy-net curlimages/curl -sf http://reviews:3000/health   # → ok
```

### 3d. Issue the TLS certificate (certbot webroot)
The proxy's default `:80` server already serves `/.well-known/acme-challenge/`.

> **GOTCHA (learned the hard way):** the proxy's `certbot` service has a custom
> entrypoint (the `certbot renew` loop with `sleep 12h`). You **must** override it
> with `--entrypoint certbot`, or `compose run` just sits in the renew loop and
> hangs — no cert is issued. (The box `/opt/apps/readme.md` snippet omits this.)

```bash
cd /opt/apps/proxy
docker compose run --rm --entrypoint certbot certbot certonly --webroot \
    -w /var/www/certbot \
    -d reviews.bakeoff.app \
    --email javokhir@raisedash.com --agree-tos --no-eff-email --non-interactive
```
Auto-renewal: the always-on `certbot` daemon in the proxy stack runs `certbot
renew` every 12h and will renew this cert too. (It does not reload nginx after a
renewal — box-wide caveat; reload nginx manually or add a deploy-hook if a cert
ever renews in place.)

### 3e. Enable the nginx vhost
Only now — cert + container both exist:
```bash
# Copy deploy/nginx/reviews.bakeoff.app.conf → /opt/apps/proxy/conf.d/
docker compose -f /opt/apps/proxy/docker-compose.yml exec nginx nginx -t   # MUST pass
docker compose -f /opt/apps/proxy/docker-compose.yml exec nginx nginx -s reload
```
> If `nginx -t` fails, the conf is bad — **do not reload** (it would break every
> site). Fix the conf (usually a missing cert path or the container isn't up).

### 3f. Verify end-to-end
```bash
curl -sf https://reviews.bakeoff.app/health        # → ok
```
Then in a browser: paste a Google Maps URL → confirm → interview → generate →
copy & open Google. Confirm a row lands in the DB:
```bash
docker exec reviews node -e "const d=require('better-sqlite3')('/data/app.db',{readonly:true});console.log(d.prepare('select count(*) n from reviews').get())"
```

---

## 4. Routine deploy / update

```bash
# 1) locally
./deploy/scripts/build-and-push.sh            # note the printed <tag>
# 2) on the box
/opt/apps/scripts/deploy.sh reviews <tag>     # rewrites TAG in .env, pulls, up -d
```
Only the `reviews` container restarts; other apps are untouched. Downtime is a
few seconds (single replica — fine for an MVP).

## 5. Rollback
```bash
/opt/apps/scripts/deploy.sh reviews <previous-tag>
```
(Image tags are immutable history in ECR; `:latest` just moves. Pin a known-good
SHA to roll back.)

---

## 6. Backups (enable before real launch — required by MVP_GUIDELINES §8/§9)

The whole DB is one file on the `reviews_data` volume. `deploy/scripts/backup.sh`
takes a consistent online snapshot and uploads it to S3.

**Enable at launch:**
1. Create/choose an S3 bucket; ensure the instance role can `s3:PutObject` to it.
2. Copy `deploy/scripts/backup.sh` → `/opt/apps/reviews/backup.sh` (`chmod +x`).
3. Add a cron entry:
   ```bash
   echo '0 4 * * * BACKUP_S3_BUCKET=s3://YOUR-BUCKET/easy-reviews /opt/apps/reviews/backup.sh >> /var/log/reviews-backup.log 2>&1' | sudo tee /etc/cron.d/reviews-backup
   ```

**Restore drill (do this once before launch — a backup you haven't restored is a hope):**
```bash
# pull a backup down and unzip
aws s3 cp s3://YOUR-BUCKET/easy-reviews/app-<ts>.db.gz . && gunzip app-<ts>.db.gz
# stop the app, replace the file in the volume via a throwaway container, restart
cd /opt/apps/reviews && docker compose stop
docker run --rm -v reviews_data:/data -v "$PWD":/restore alpine \
    sh -c 'cp /restore/app-<ts>.db /data/app.db && rm -f /data/app.db-wal /data/app.db-shm'
docker compose up -d
```

> **Never run `docker compose down -v`** in `/opt/apps/reviews` — `-v` deletes the
> `reviews_data` volume (the entire database). `down` without `-v` is safe.

---

## 7. Troubleshooting

| Symptom | Check |
|---------|-------|
| Container restart-loops, logs `exec format error` / `platform ... amd64 ... does not match arm64` | Image built for the wrong arch — rebuild with `--platform linux/arm64` (the script already does). |
| Boot crash mentioning `better_sqlite3.node` / `invalid ELF` / ABI | Native driver mismatch — the Dockerfile's `npm rebuild better-sqlite3 --build-from-source` should prevent this; confirm it ran. |
| App up but QR / "copy link" point to `localhost:3000` | `NEXT_PUBLIC_APP_URL` wasn't set at **build** time — rebuild with the build-arg. |
| 502 from nginx | `docker ps \| grep reviews` running? On `proxy-net`? `docker network inspect proxy-net`. |
| `EROFS` / read-only FS write errors | Something writes outside `/data`, `/tmp`, `/app/.next/cache` — add a tmpfs or write to the volume. |
| Anthropic/Google calls fail with network error | Container must be on `proxy-net` (has egress); it must NOT be on an `internal: true` net only. |
| `nginx -t` fails after adding the vhost | Cert missing (`/etc/letsencrypt/live/reviews.bakeoff.app/`) or upstream down — fix before reload. |
| Container logs | `docker compose -f /opt/apps/reviews/docker-compose.yml logs -f --tail 100` |

---

## 8. Key gotchas (read once)

- **ARM64 only.** Always build `--platform linux/arm64`. amd64 boot-loops here.
- **`NEXT_PUBLIC_APP_URL` is build-time.** It's inlined into the client bundle, so
  it must be passed as a `--build-arg` (the build script defaults it to the prod URL).
- **DB lives on the volume, not the image.** `read_only` root FS + writable `/data`.
- **`down -v` deletes the database.** Use `down` / `stop` only.
- **One replica.** SQLite is single-writer; do not scale the service.
