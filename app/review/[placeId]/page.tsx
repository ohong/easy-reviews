import { notFound } from "next/navigation";
import { getPlaceSummary, PlacesError } from "@/lib/places";
import { ReviewFlow } from "./_components/review-flow";

/**
 * Entry into the review flow for a business. Pasted-URL entries arrive with
 * `?confirm=1` and must confirm the place before any work (FR-1.4); QR entries
 * carry an authoritative place_id and skip straight to prep.
 */
export default async function ReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ placeId: string }>;
  searchParams: Promise<{ confirm?: string }>;
}) {
  const { placeId } = await params;
  const { confirm } = await searchParams;

  let business;
  try {
    business = await getPlaceSummary(decodeURIComponent(placeId));
  } catch (err) {
    if (err instanceof PlacesError && err.status === 404) notFound();
    throw err;
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-14">
      <ReviewFlow business={business} needsConfirm={confirm === "1"} />
    </main>
  );
}
