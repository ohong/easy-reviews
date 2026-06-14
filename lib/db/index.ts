import "server-only";
import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { env } from "@/lib/env";
import * as schema from "./schema";

// better-sqlite3 wants a plain filesystem path, not a file: URL.
const dbPath = env.DATABASE_URL.startsWith("file:")
  ? env.DATABASE_URL.slice("file:".length)
  : env.DATABASE_URL;

// better-sqlite3 won't create parent dirs — make sure the data dir exists.
if (dbPath !== ":memory:") {
  fs.mkdirSync(path.dirname(path.resolve(dbPath)), { recursive: true });
}

const sqlite = new Database(dbPath);
// Pragmas — set once, before the first query (see MVP_GUIDELINES §6).
sqlite.pragma("journal_mode = WAL"); // many readers + one writer, no lock errors
sqlite.pragma("busy_timeout = 5000"); // wait instead of throwing on a busy DB
sqlite.pragma("synchronous = NORMAL"); // safe under WAL, much faster
sqlite.pragma("foreign_keys = ON"); // per-connection — SQLite defaults it OFF

export const db = drizzle({ client: sqlite, schema });
export { sqlite, schema };
