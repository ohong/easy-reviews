"use client";

import Link from "next/link";
import { MapPin, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StarDisplay } from "@/components/ui/star-rating";
import { Stepper } from "@/components/ui/stepper";
import type { ResolvedBusiness } from "@/lib/types";

export function ConfirmCard({
  business,
  onConfirm,
}: {
  business: ResolvedBusiness;
  onConfirm: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8">
      <Stepper current="find" />

      <div className="flex flex-col gap-2 text-center">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          We found your{" "}
          <span className="italic text-primary">business.</span>
        </h1>
        <p className="text-muted-foreground">
          We&apos;ll tailor a quick check-in for this place.
        </p>
      </div>

      <Card className="rounded-2xl bg-card shadow-card ring-1 ring-border/70">
        <CardContent className="flex flex-col gap-4 p-5">
          {/* Business identity row */}
          <div className="flex items-center gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
              <Store className="size-6" />
            </span>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-heading text-xl leading-snug font-semibold truncate">
                {business.name}
              </span>
              {business.category && (
                <span className="text-sm text-muted-foreground">
                  {business.category}
                </span>
              )}
            </div>
          </div>

          {/* Rating row */}
          {business.rating != null && (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold tabular-nums">
                {business.rating.toFixed(1)}
              </span>
              <StarDisplay value={Math.round(business.rating)} size={16} />
              <span className="text-muted-foreground text-xs">on Google</span>
            </div>
          )}

          {/* Address row */}
          {business.address && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary/70" />
              <span>{business.address}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <Button size="lg" onClick={onConfirm} className="w-full">
          Yes, that&apos;s it →
        </Button>
        <Button
          size="lg"
          variant="ghost"
          nativeButton={false}
          render={<Link href="/start" />}
          className="w-full text-muted-foreground"
        >
          Not quite — search instead
        </Button>
      </div>
    </div>
  );
}
