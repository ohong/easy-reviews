"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { StarRating } from "@/components/ui/star-rating";
import { Stepper } from "@/components/ui/stepper";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  AnswerValue,
  InterviewAnswers,
  Question,
  QuestionSet,
} from "@/lib/types";

interface StoredAnswer {
  value: AnswerValue;
  labels?: string[];
}

const slide = {
  enter: (dir: number) => ({ x: dir >= 0 ? 64 : -64, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir >= 0 ? -64 : 64, opacity: 0 }),
};

export function Interview({
  questionSet,
  onComplete,
  submitting = false,
  error,
}: {
  questionSet: QuestionSet;
  onComplete: (answers: InterviewAnswers, rating: number) => void;
  submitting?: boolean;
  error?: string | null;
}) {
  const questions = questionSet.questions;
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [answers, setAnswers] = useState<Record<string, StoredAnswer>>({});

  const q = questions[index];
  const isLast = index === questions.length - 1;
  const ratingQ = questions.find((x) => x.type === "rating");
  const rating = ratingQ ? Number(answers[ratingQ.id]?.value ?? 0) : 0;

  function setAnswer(id: string, value: AnswerValue, labels?: string[]) {
    setAnswers((prev) => ({ ...prev, [id]: { value, labels } }));
  }

  function go(step: number) {
    const next = index + step;
    if (next < 0) return;
    if (next >= questions.length) return finish();
    setDir(step);
    setIndex(next);
  }

  function finish() {
    if (!rating) return; // rating gate — shouldn't happen (it's first + required)
    const built: InterviewAnswers = questions.map((question) => {
      const a = answers[question.id];
      const fallback: AnswerValue =
        question.type === "multi" ? [] : question.type === "rating" ? 0 : "";
      return {
        questionId: question.id,
        prompt: question.prompt,
        type: question.type,
        value: a?.value ?? fallback,
        labels: a?.labels,
      };
    });
    onComplete(built, rating);
  }

  // Auto-advance for the quick single-choice steps.
  function pickAndAdvance(id: string, value: AnswerValue, labels?: string[]) {
    setAnswer(id, value, labels);
    window.setTimeout(() => {
      setDir(1);
      setIndex((i) => Math.min(i + 1, questions.length - 1));
    }, 240);
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-8">
      <Stepper current="answer" />

      {/* Progress header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-foreground truncate">
            {questionSet.businessName}
          </span>
          <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
            Question {index + 1} of {questions.length}
          </span>
        </div>
        <Progress value={((index + 1) / questions.length) * 100} />
      </div>

      {/* Question card */}
      <Card className="rounded-2xl bg-card shadow-card ring-1 ring-border/70">
        <CardContent className="p-6">
          <div className="relative min-h-[240px]">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.div
                key={q.id}
                custom={dir}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.24, ease: "easeInOut" }}
                className="flex flex-col gap-6"
              >
                <div className="flex flex-col gap-1.5">
                  <h2 className="font-heading text-2xl font-semibold tracking-tight text-balance">
                    {q.prompt}
                  </h2>
                  {q.helpText && (
                    <p className="text-sm text-muted-foreground">{q.helpText}</p>
                  )}
                  {q.type === "multi" && (
                    <p className="text-sm text-muted-foreground">
                      Pick any that apply.
                    </p>
                  )}
                </div>

                <QuestionInput
                  question={q}
                  answer={answers[q.id]}
                  onRating={(v) => pickAndAdvance(q.id, v)}
                  onSingle={(id, label) => pickAndAdvance(q.id, id, [label])}
                  onMulti={(ids, labels) => setAnswer(q.id, ids, labels)}
                  onText={(t) => setAnswer(q.id, t)}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {/* Navigation bar */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="lg"
          onClick={() => go(-1)}
          disabled={index === 0 || submitting}
          className={cn(index === 0 && "invisible")}
        >
          <ArrowLeft /> Back
        </Button>

        {isLast ? (
          <Button size="lg" onClick={finish} disabled={!rating || submitting}>
            <Sparkles />
            {submitting ? "Writing…" : "Write my review"}
          </Button>
        ) : (
          <Button
            size="lg"
            variant={q.type === "rating" || q.type === "single" ? "ghost" : "default"}
            onClick={() => go(1)}
            disabled={submitting}
          >
            {q.type === "multi" || q.type === "text" ? "Next" : "Skip"}
            <ArrowRight />
          </Button>
        )}
      </div>
    </div>
  );
}

function QuestionInput({
  question,
  answer,
  onRating,
  onSingle,
  onMulti,
  onText,
}: {
  question: Question;
  answer?: StoredAnswer;
  onRating: (v: number) => void;
  onSingle: (id: string, label: string) => void;
  onMulti: (ids: string[], labels: string[]) => void;
  onText: (t: string) => void;
}) {
  if (question.type === "rating") {
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <StarRating
          value={Number(answer?.value ?? 0)}
          onChange={onRating}
          label={question.prompt}
        />
        <p className="text-xs text-muted-foreground">Tap a star to continue.</p>
      </div>
    );
  }

  if (question.type === "text") {
    return (
      <Textarea
        autoFocus
        value={String(answer?.value ?? "")}
        onChange={(e) => onText(e.target.value)}
        placeholder="Optional — a sentence in your own words helps."
        className="min-h-28 text-base"
        maxLength={400}
      />
    );
  }

  const options = question.options ?? [];

  if (question.type === "single") {
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((o) => (
          <Chip
            key={o.id}
            selected={answer?.value === o.id}
            onClick={() => onSingle(o.id, o.label)}
          >
            {o.label}
          </Chip>
        ))}
      </div>
    );
  }

  // multi
  const selected = Array.isArray(answer?.value) ? (answer!.value as string[]) : [];
  function toggle(id: string, label: string) {
    const next = selected.includes(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id];
    const labels = options
      .filter((o) => next.includes(o.id))
      .map((o) => o.label);
    onMulti(next, labels);
    void label;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <Chip
          key={o.id}
          selected={selected.includes(o.id)}
          onClick={() => toggle(o.id, o.label)}
        >
          {o.label}
        </Chip>
      ))}
    </div>
  );
}

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:bg-secondary hover:border-primary/30",
      )}
    >
      {children}
    </button>
  );
}
