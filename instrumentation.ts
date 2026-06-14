/**
 * Runs once when the server process boots (Node.js runtime only). We apply
 * database migrations here so a fresh deploy (or first `next dev`) has its
 * schema in place before serving requests — no separate migrate step needed.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { runMigrations } = await import("@/lib/db/migrate");
    try {
      runMigrations();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[db] migration failed:", err);
      throw err;
    }
  }
}
