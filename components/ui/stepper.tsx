import { Fragment } from "react";
import { Search, PenLine, Star, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type FlowStep = "find" | "answer" | "review" | "post";

const STEPS: {
  key: FlowStep;
  label: string;
  icon?: LucideIcon;
  glyph?: string;
}[] = [
  { key: "find", label: "Find", icon: Search },
  { key: "answer", label: "Answer", icon: PenLine },
  { key: "review", label: "Review", icon: Star },
  { key: "post", label: "Post", glyph: "G" },
];

/**
 * Four-step flow indicator (Find → Answer → Review → Post), matching the
 * design mockups: icon circles joined by dashed connectors, the current and
 * completed steps filled olive, upcoming steps muted.
 */
export function Stepper({
  current,
  className,
}: {
  current: FlowStep;
  className?: string;
}) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);

  return (
    <nav
      aria-label="Progress"
      className={cn("mx-auto flex w-full max-w-md items-start", className)}
    >
      {STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        const filled = done || active;
        const Icon = step.icon;
        return (
          <Fragment key={step.key}>
            <div
              className="flex flex-col items-center gap-1.5"
              aria-current={active ? "step" : undefined}
            >
              <span
                className={cn(
                  "flex size-10 items-center justify-center rounded-full border transition-colors",
                  filled
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground",
                  active &&
                    "ring-2 ring-primary/25 ring-offset-2 ring-offset-background",
                )}
              >
                {Icon ? (
                  <Icon className="size-[1.05rem]" />
                ) : (
                  <span className="font-serif text-base leading-none font-semibold">
                    {step.glyph}
                  </span>
                )}
              </span>
              <span
                className={cn(
                  "text-xs font-medium",
                  filled ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span
                aria-hidden="true"
                className={cn(
                  "mt-5 h-0 flex-1 border-t-2 border-dashed",
                  done ? "border-primary/45" : "border-border",
                )}
              />
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
