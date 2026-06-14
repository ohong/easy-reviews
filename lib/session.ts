const KEY = "er_session_id";

/**
 * Stable per-browser session id (localStorage). Lets anonymous users own their
 * generations and enables claim-on-signup later. Returns "" during SSR.
 */
export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(KEY, id);
  }
  return id;
}
