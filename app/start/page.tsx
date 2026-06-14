import type { Metadata } from "next";
import { Search } from "lucide-react";
import { BusinessSearch } from "./_components/business-search";

export const metadata: Metadata = { title: "Find the business" };

export default async function StartPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 py-12 sm:py-16">
      <div className="flex flex-col gap-6">
        {/* Icon tile */}
        <div className="flex justify-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-sage-tint text-sage-deep shadow-soft">
            <Search className="size-6" />
          </div>
        </div>

        <div className="flex flex-col gap-2 text-center">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Find the business
          </h1>
          <p className="text-sm text-muted-foreground text-pretty">
            Search for the place you visited and pick it from the list.
          </p>
        </div>

        <BusinessSearch initialQuery={q ?? ""} />
      </div>
    </main>
  );
}
