#!/usr/bin/env bash
# Nightly backup of the easy-reviews SQLite DB to S3, using better-sqlite3's
# online backup API (a consistent snapshot of the live WAL database).
#
# Runs ON THE EC2 BOX. Copy to /opt/apps/reviews/backup.sh. Enable via cron only
# at launch (see DEPLOY.md §Backups):
#   0 4 * * *  BACKUP_S3_BUCKET=s3://my-bucket/easy-reviews /opt/apps/reviews/backup.sh >> /var/log/reviews-backup.log 2>&1
#
# Requires: docker + aws CLI. The instance role needs s3:PutObject on the bucket.
set -euo pipefail

S3_DEST="${BACKUP_S3_BUCKET:?set BACKUP_S3_BUCKET=s3://bucket/prefix}"
CONTAINER="${CONTAINER:-reviews}"
TS="$(date -u +%Y%m%dT%H%M%SZ)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

# Snapshot inside the container (its /tmp is a writable tmpfs) using the app's own
# better-sqlite3 — db.backup() is the safe online-backup path for a live WAL DB.
docker exec -i "$CONTAINER" node <<'JS'
const Database = require("better-sqlite3");
const src = (process.env.DATABASE_URL || "file:/data/app.db").replace(/^file:/, "");
const db = new Database(src, { readonly: true });
db.backup("/tmp/reviews-backup.db")
  .then(() => { db.close(); })
  .catch((e) => { console.error(e); process.exit(1); });
JS

docker cp "${CONTAINER}:/tmp/reviews-backup.db" "${WORK}/app-${TS}.db"
docker exec "$CONTAINER" rm -f /tmp/reviews-backup.db
gzip "${WORK}/app-${TS}.db"
aws s3 cp "${WORK}/app-${TS}.db.gz" "${S3_DEST%/}/app-${TS}.db.gz"
echo "✓ Backed up easy-reviews DB → ${S3_DEST%/}/app-${TS}.db.gz"
