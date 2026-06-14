import { redirect } from "next/navigation";

/**
 * Query-form entry: `/review?placeId=…` (the shape the spec + business QR codes
 * use) normalized to the app's canonical `/review/[placeId]` route. QR scans
 * omit `confirm` and drop straight into interview prep; pasted-link entries pass
 * `confirm=1` to show the confirmation card first (FR-1.4).
 */
export default async function ReviewQueryEntry({
  searchParams,
}: {
  searchParams: Promise<{ placeId?: string; confirm?: string }>;
}) {
  const { placeId, confirm } = await searchParams;
  const id = placeId?.trim();
  if (!id) redirect("/start");
  const suffix = confirm === "1" ? "?confirm=1" : "";
  redirect(`/review/${encodeURIComponent(id)}${suffix}`);
}
