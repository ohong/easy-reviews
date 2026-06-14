import { NextResponse, type NextRequest } from "next/server";

/**
 * Next 16 middleware (renamed from `middleware.ts`). Node runtime.
 *
 * Normalizes the spec/QR query form `/review?placeId=…` to the canonical
 * `/review/[placeId]` path with a REAL HTTP redirect, so it works for every
 * client — link unfurlers, QR scanners that pre-fetch, no-JS — not just a live
 * browser (a page-level `redirect()` becomes a soft client redirect here
 * because `app/loading.tsx` opens a streaming boundary). QR scans omit
 * `confirm` and drop straight into interview prep; pasted links keep `confirm=1`.
 */
export function proxy(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const placeId = searchParams.get("placeId")?.trim();

  const url = request.nextUrl.clone();
  url.search = "";

  if (!placeId) {
    url.pathname = "/start";
    return NextResponse.redirect(url);
  }

  url.pathname = `/review/${encodeURIComponent(placeId)}`;
  if (searchParams.get("confirm") === "1") url.searchParams.set("confirm", "1");
  return NextResponse.redirect(url);
}

// Only intercept the exact `/review` index — never `/review/[placeId]`.
export const config = {
  matcher: ["/review"],
};
