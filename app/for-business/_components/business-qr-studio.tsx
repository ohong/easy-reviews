"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  ExternalLink,
  Loader2,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BusinessSearch } from "@/app/start/_components/business-search";
import type { PlaceSuggestion } from "@/lib/places";
import { generateQrAction, type QrResult } from "../actions";

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "business"
  );
}

export function BusinessQrStudio() {
  const [picked, setPicked] = useState<PlaceSuggestion | null>(null);
  const [qr, setQr] = useState<QrResult | null>(null);
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  function pick(s: PlaceSuggestion) {
    setPicked(s);
    setQr(null);
    setCopied(false);
    startTransition(async () => {
      setQr(await generateQrAction(s.placeId));
    });
  }

  function reset() {
    setPicked(null);
    setQr(null);
    setCopied(false);
  }

  async function copyLink(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied.");
    } catch {
      toast.error("Couldn't copy — select the link and copy it.");
    }
  }

  if (!picked) {
    return (
      <div className="flex flex-col gap-3">
        <BusinessSearch onPick={pick} />
        <p className="px-1 text-xs text-muted-foreground">
          Pick your business to get a printable QR code and a shareable link.
        </p>
      </div>
    );
  }

  const slug = slugify(picked.mainText || "business");

  return (
    <div className="flex flex-col gap-5">
      {/* Picked business header row */}
      <div className="flex items-start justify-between gap-3 rounded-2xl bg-card px-4 py-3.5 shadow-soft ring-1 ring-border/70">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-sage-tint text-sage-deep">
            <MapPin className="size-4" />
          </span>
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{picked.mainText}</span>
            {picked.secondaryText && (
              <span className="text-sm text-muted-foreground">
                {picked.secondaryText}
              </span>
            )}
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={reset}>
          <ArrowLeft />
          Pick another
        </Button>
      </div>

      {/* Loading state */}
      {pending && (
        <div className="flex items-center justify-center gap-2 rounded-2xl bg-card py-16 shadow-soft ring-1 ring-border/70">
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Generating your QR code…</span>
        </div>
      )}

      {/* Error state */}
      {!pending && qr && !qr.ok && (
        <p className="text-sm text-destructive" role="alert">
          {qr.error}
        </p>
      )}

      {/* QR result */}
      {!pending && qr && qr.ok && (
        <>
          <Card className="items-center gap-5 p-6">
            {/* PNG data URL — fixed intrinsic size; unoptimized (data URI). */}
            <Image
              src={qr.png}
              alt={`QR code linking to the review page for ${picked.mainText}`}
              width={240}
              height={240}
              unoptimized
              className="size-60 rounded-xl bg-white p-3 ring-1 ring-foreground/10 shadow-soft"
            />

            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                nativeButton={false}
                render={
                  <a href={qr.png} download={`easy-reviews-${slug}-qr.png`} />
                }
              >
                <Download />
                PNG
              </Button>
              <Button
                variant="outline"
                nativeButton={false}
                render={
                  <a
                    href={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(qr.svg)}`}
                    download={`easy-reviews-${slug}-qr.svg`}
                  />
                }
              >
                <Download />
                SVG
              </Button>
            </div>

            <p className="max-w-sm text-center text-xs text-muted-foreground text-pretty">
              Print it on your receipt, counter, or table. Scanning opens a
              60-second review for {picked.mainText}.
            </p>
          </Card>

          {/* Shareable link row */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">Shareable link</span>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-xl border border-border bg-muted/50 px-3.5 py-2.5 text-sm text-foreground/80">
                {qr.url}
              </code>
              <Button
                variant="outline"
                size="icon"
                aria-label="Copy link"
                onClick={() => copyLink(qr.url)}
              >
                {copied ? <Check /> : <Copy />}
              </Button>
            </div>
            <div className="mt-0.5">
              <Button
                variant="link"
                size="sm"
                className="px-0"
                nativeButton={false}
                render={
                  <Link href={qr.url} target="_blank" rel="noopener noreferrer" />
                }
              >
                Preview the review page
                <ExternalLink className="opacity-70" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
