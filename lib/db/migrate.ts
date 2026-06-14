import "server-only";
import path from "node:path";
import fs from "node:fs";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db } from "./index";

/**
 * Apply pending migrations. Synchronous (better-sqlite3), idempotent, and safe
 * to call on every boot — already-applied migrations are skipped via the
 * `__drizzle_migrations` table. Invoked from `instrumentation.ts` at startup.
 */
export function runMigrations(): void {
  const migrationsFolder = path.join(process.cwd(), "drizzle");
  if (!fs.existsSync(migrationsFolder)) {
    // eslint-disable-next-line no-console
    console.warn(
      `[db] migrations folder not found at ${migrationsFolder} — skipping (run \`bun run db:generate\`).`,
    );
    return;
  }
  migrate(db, { migrationsFolder });
}
