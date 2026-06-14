"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { Loader2, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmCard } from "./confirm-card";
import { Interview } from "./interview";
import { Result } from "./result";
import { getSessionId } from "@/lib/session";
import { generateReviewAction, prepareInterviewAction } from "../actions";
import type { InterviewAnswers, QuestionSet, ResolvedBusiness } from "@/lib/types";

type Phase =
  | { name: "confirm" }
  | { name: "preparing" }
  | { name: "prepare_error"; error: string }
  | { name: "interview" }
  | { name: "result"; reviewId: string; text: string; rating: number };

export function ReviewFlow({
  business,
  needsConfirm,
}: {
  business: ResolvedBusiness;
  needsConfirm: boolean;
}) {
  const [phase, setPhase] = useState<Phase>(
    needsConfirm ? { name: "confirm" } : { name: "preparing" },
  );
  const [questionSet, setQuestionSet] = useState<QuestionSet | null>(null);
  const [submitting, startSubmit] = useTransition();
  const [genError, setGenError] = useState<string | null>(null);
  const startedRef = useRef(false);

  const prepare = useCallback(async () => {
    setPhase({ name: "preparing" });
    const res = await prepareInterviewAction(business.placeId);
    if (res.ok) {
      setQuestionSet(res.questionSet);
      setPhase({ name: "interview" });
    } else {
      setPhase({ name: "prepare_error", error: res.error });
    }
  }, [business.placeId]);

  // QR entry (no confirm) auto-starts prep. Guard against StrictMode double-run.
  useEffect(() => {
    if (!needsConfirm && !startedRef.current) {
      startedRef.current = true;
      void prepare();
    }
  }, [needsConfirm, prepare]);

  function handleComplete(answers: InterviewAnswers, rating: number) {
    setGenError(null);
    startSubmit(async () => {
      const res = await generateReviewAction({
        placeId: business.placeId,
        rating,
        answers,
        sessionId: getSessionId(),
      });
      if (res.ok) {
        setPhase({
          name: "result",
          reviewId: res.reviewId,
          text: res.text,
          rating: res.rating,
        });
      } else {
        setGenError(res.error);
      }
    });
  }

  switch (phase.name) {
    case "confirm":
      return (
        <ConfirmCard
          business={business}
          onConfirm={() => {
            startedRef.current = true;
            void prepare();
          }}
        />
      );
    case "preparing":
      return <Preparing name={business.name} />;
    case "prepare_error":
      return <PrepareError error={phase.error} onRetry={prepare} />;
    case "interview":
      return questionSet ? (
        <Interview
          questionSet={questionSet}
          onComplete={handleComplete}
          submitting={submitting}
          error={genError}
        />
      ) : (
        <Preparing name={business.name} />
      );
    case "result":
      return (
        <Result
          reviewId={phase.reviewId}
          placeId={business.placeId}
          initialText={phase.text}
          rating={phase.rating}
          businessName={business.name}
        />
      );
  }
}

function Preparing({ name }: { name: string }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-5 py-20 text-center">
      <Loader2 className="size-8 animate-spin text-primary" />
      <div className="flex flex-col gap-1.5">
        <p className="font-heading text-lg font-semibold">
          Prepping a few quick questions…
        </p>
        <p className="text-sm text-muted-foreground text-pretty">
          Reading recent reviews for{" "}
          <span className="font-medium text-foreground">{name}</span> so we can
          keep it short.
        </p>
      </div>
    </div>
  );
}

function PrepareError({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-5 py-20 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-terracotta-tint">
        <SearchX className="size-6 text-[oklch(0.5_0.14_40)]" />
      </span>
      <div className="flex flex-col gap-1.5">
        <p className="font-heading text-lg font-semibold">
          Something went wrong
        </p>
        <p className="text-sm text-muted-foreground text-pretty">{error}</p>
      </div>
      <div className="flex gap-2">
        <Button onClick={onRetry}>Try again</Button>
        <Button variant="ghost" nativeButton={false} render={<Link href="/start" />}>
          Search instead
        </Button>
      </div>
    </div>
  );
}
