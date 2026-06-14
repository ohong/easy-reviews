// §6 Sessions (WS-E) + RLS posture.
import { describe, test } from "bun:test";

describe("Sessions & data access", () => {
  test.todo("AC-SES-1: anonymous session_id generated + persisted in localStorage across reloads", () => {});
  test.todo("AC-SES-2: every reviews row carries session_id, user_id null", () => {});
  test.todo("AC-SES-3: no client-side reviews read/write; direct client query denied by RLS", () => {});
});
