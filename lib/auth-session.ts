import "server-only";

/**
 * The currently signed-in user id, or null when anonymous.
 *
 * Stubbed for the anonymous-first core flow; wired to Better Auth in WS-E so
 * the rest of the app can depend on it without churn.
 */
export async function getOptionalUserId(): Promise<string | null> {
  return null;
}
