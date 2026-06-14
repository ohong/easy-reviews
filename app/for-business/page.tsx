import type { Metadata } from "next";
import { QrCode } from "lucide-react";
import { features } from "@/lib/env";
import { BusinessQrStudio } from "./_components/business-qr-studio";

export const metadata: Metadata = {
  title: "For businesses",
  description:
    "Find your business and get a printable QR code that turns happy customers into honest, well-written Google reviews in under a minute.",
};

export default function ForBusinessPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 py-12 sm:py-16">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Icon tile */}
          <div className="flex size-14 items-center justify-center rounded-2xl bg-sage-tint text-sage-deep shadow-soft">
            <QrCode className="size-6" />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="font-heading text-3xl font-semibold tracking-tight">
              Get reviews from{" "}
              <span className="italic text-primary">happy customers</span>
            </h1>
            <p className="max-w-md text-sm text-muted-foreground text-pretty">
              Find your business below to get a printable QR code and a link.
              Customers scan it and leave an honest, well-written review in under
              a minute — in their own words, posted by them.
            </p>
          </div>
        </div>

        <BusinessQrStudio signsEnabled={features.imageGeneration} />
      </div>
    </main>
  );
}
