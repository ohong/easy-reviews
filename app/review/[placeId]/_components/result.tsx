"use client";

import { useState, useTransition } from "react";
import { Check, Copy, ExternalLink, RefreshCw, Leaf } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { StarDisplay } from "@/components/ui/star-rating";
import { Stepper } from "@/components/ui/stepper";
import { writeReviewUrl } from "@/lib/types";
import { getSessionId } from "@/lib/session";
import {
  markPostedAction,
  regenerateReviewAction,
  saveFinalTextAction,
} from "../actions";

export function Result({
  reviewId,
  placeId,
  initialText,
  rating,
  businessName,
}: {
  reviewId: string;
  placeId: string;
  initialText: string;
  rating: number;
  businessName: string;
}) {
  const [text, setText] = useState(initialText);
  const [regenerating, startRegen] = useTransition();
  const [copied, setCopied] = useState(false);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  function regenerate() {
    startRegen(async () => {
      const res = await regenerateReviewAction({
        reviewId,
        sessionId: getSessionId(),
        avoid: text,
      });
      if (res.ok) {
        setText(res.text);
        setCopied(false);
        toast.success("Here's a fresh take.");
      } else {
        toast.error(res.error || "Couldn't regenerate — try again.");
      }
    });
  }

  function persist() {
    void saveFinalTextAction({
      reviewId,
      finalText: text,
      sessionId: getSessionId(),
    });
  }

  async function copyAndOpen() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      toast.error("Couldn't copy automatically — select the text and copy it.");
    }
    persist();
    void markPostedAction({ reviewId, sessionId: getSessionId() });
    toast.success("Copied! Paste it into Google and set your stars.");
    window.open(writeReviewUrl(placeId), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-8">
      <Stepper current={copied ? "post" : "review"} />

      {/* Heading */}
      <div className="flex flex-col gap-1.5">
        {copied ? (
          <>
            <h1 className="font-heading text-4xl font-semibold tracking-tight leading-tight sm:text-5xl">
              Your review{" "}
              <span className="italic text-primary">is ready.</span>
            </h1>
            <p className="text-muted-foreground">
              Copy it, open Google Maps, and post it yourself.
            </p>
          </>
        ) : (
          <>
            <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Here&apos;s your{" "}
              <span className="italic text-primary">draft.</span>
            </h1>
            <p className="text-muted-foreground">
              Built from your answers.
            </p>
          </>
        )}
      </div>

      {/* Business header + review card */}
      <Card className="rounded-2xl bg-card shadow-card ring-1 ring-border/70">
        <CardContent className="flex flex-col gap-4 p-5">
          {/* Business row */}
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
              <Leaf className="size-5" />
            </span>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-heading text-lg leading-tight font-semibold truncate">
                {businessName}
              </span>
              <div className="flex items-center gap-1.5 text-sm">
                <StarDisplay value={rating} size={15} />
                <span className="text-muted-foreground text-xs">
                  suggested rating
                </span>
              </div>
            </div>
          </div>

          {/* Editable review text */}
          <div className="flex flex-col gap-1.5">
            <Textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setCopied(false);
              }}
              onBlur={persist}
              className="min-h-40 text-base leading-relaxed bg-secondary/40 border-border/60"
              aria-label="Your review"
              maxLength={1500}
            />
            <div className="flex justify-end text-xs text-muted-foreground">
              {words} words
            </div>
          </div>

          {/* Tone / style buttons row */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={regenerate}
              disabled={regenerating}
            >
              <RefreshCw className={regenerating ? "animate-spin" : undefined} />
              {regenerating ? "Rewriting…" : "Shorter"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={regenerate}
              disabled={regenerating}
            >
              More casual
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={regenerate}
              disabled={regenerating}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Primary CTA */}
      <Button
        size="lg"
        onClick={copyAndOpen}
        disabled={!text.trim()}
        className="w-full"
      >
        {copied ? <Check /> : <Copy />}
        {copied ? "Copy review again" : "Continue to share →"}
        {!copied && <ExternalLink className="opacity-70" />}
      </Button>

      {/* Post instructions — shown after copy */}
      {copied && (
        <Card className="rounded-2xl bg-card shadow-card ring-1 ring-border/70">
          <CardContent className="flex flex-col gap-4 p-5">
            <h2 className="font-heading text-base font-semibold">
              How to post in 3 simple steps
            </h2>
            <ol className="flex flex-col gap-3">
              {[
                { n: 1, text: "Open Google Maps" },
                { n: 2, text: "Paste your review" },
                { n: 3, text: "Post it" },
              ].map(({ n, text: stepText }) => (
                <li key={n} className="flex items-start gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    {n}
                  </span>
                  <span className="pt-0.5 text-sm text-foreground">{stepText}</span>
                </li>
              ))}
            </ol>
            <p className="text-xs text-muted-foreground">
              No accounts. No auto-posting. You&apos;re in control.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
