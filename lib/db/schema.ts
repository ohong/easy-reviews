import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real, index } from "drizzle-orm/sqlite-core";
// Relative import (not the @/ alias) so drizzle-kit's loader resolves it.
import type { QuestionSet, InterviewAnswers } from "../types";

const createdAt = () =>
  integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`);

const updatedAt = () =>
  integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => new Date());

// ── Domain ──────────────────────────────────────────────────────────────────

/** One row per resolved business; caches its generated interview + summary. */
export const businesses = sqliteTable("businesses", {
  placeId: text("place_id").primaryKey(),
  name: text("name").notNull(),
  address: text("address"),
  category: text("category"),
  primaryType: text("primary_type"),
  lat: real("lat"),
  lng: real("lng"),
  rating: real("rating"),
  /** AI summary of up to 5 Places reviews (nudges question relevance). */
  reviewSummary: text("review_summary"),
  /** Cached generated question set (the B↔C contract). */
  questionSet: text("question_set", { mode: "json" }).$type<QuestionSet>(),
  questionsGeneratedAt: integer("questions_generated_at", { mode: "timestamp" }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

/** One row per generation (the user's interview → review). */
export const reviews = sqliteTable(
  "reviews",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    placeId: text("place_id")
      .notNull()
      .references(() => businesses.placeId, { onDelete: "cascade" }),
    /** Better Auth user id; null for anonymous generations. */
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    /** Anonymous/local session id (localStorage) for later claim-on-signup. */
    sessionId: text("session_id"),
    rating: integer("rating").notNull(),
    answers: text("answers", { mode: "json" }).$type<InterviewAnswers>().notNull(),
    generatedText: text("generated_text").notNull(),
    finalText: text("final_text").notNull(),
    /** Best-effort funnel flag set when the user taps "Copy & open Google". */
    posted: integer("posted", { mode: "boolean" }).notNull().default(false),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index("reviews_place_idx").on(t.placeId),
    index("reviews_user_idx").on(t.userId),
    index("reviews_session_idx").on(t.sessionId),
  ],
);

export type Business = typeof businesses.$inferSelect;
export type NewBusiness = typeof businesses.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;

// ── Better Auth (anonymous-first + Google OAuth) ─────────────────────────────
// Shapes follow Better Auth 1.6 for the SQLite/Drizzle adapter. Column *keys*
// are camelCase (the adapter maps to them); SQL names are snake_case.

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .notNull()
    .default(false),
  image: text("image"),
  /** Added by the anonymous plugin. */
  isAnonymous: integer("is_anonymous", { mode: "boolean" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});
