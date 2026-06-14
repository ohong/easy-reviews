import { defineConfig } from "drizzle-kit";

const url = process.env.DATABASE_URL ?? "file:./data/app.db";

export default defineConfig({
  dialect: "sqlite",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: url.startsWith("file:") ? url.slice("file:".length) : url,
  },
  strict: true,
  verbose: true,
});
