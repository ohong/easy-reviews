import {
  Lock,
  PenLine,
  Copy,
  Clock,
  MessageSquareQuote,
  ShieldCheck,
  Star,
  Leaf as LeafIcon,
} from "lucide-react";
import { PasteForm } from "./_components/paste-form";
import { Badge } from "@/components/ui/badge";
import { StarDisplay } from "@/components/ui/star-rating";
import { cn } from "@/lib/utils";

type Tint = "sage" | "terracotta" | "gold";

const tintTile: Record<Tint, string> = {
  sage: "bg-sage-tint text-sage-deep",
  terracotta: "bg-terracotta-tint text-[oklch(0.5_0.14_40)]",
  gold: "bg-gold-tint text-gold-foreground",
};

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col">
      {/* Hero */}
      <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div className="flex flex-col gap-6">
          <Badge
            variant="sage"
            className="h-7 gap-1.5 self-start px-3 text-[0.78rem]"
          >
            <Lock />
            You post it yourself
          </Badge>

          <div className="flex flex-col gap-4">
            <h1 className="font-heading text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.35rem]">
              Turn a quick check-in into a{" "}
              <span className="text-primary italic">Google review</span>.
            </h1>
            <p className="max-w-md text-lg text-muted-foreground text-pretty">
              Answer a few taps. Get an honest, well-written review draft in your
              own words — in under a minute.
            </p>
          </div>

          <PasteForm />
        </div>

        <div className="relative hidden sm:block">
          <SampleReviewCard />
        </div>
      </section>

      {/* Trust features */}
      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto grid w-full max-w-4xl gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6">
          <Feature
            icon={<Clock />}
            tint="sage"
            title="Fast"
            body="Under 60 seconds, start to copy."
          />
          <Feature
            icon={<MessageSquareQuote />}
            tint="terracotta"
            title="In your words"
            body="Built only from what you actually picked."
          />
          <Feature
            icon={<ShieldCheck />}
            tint="gold"
            title="You stay in control"
            body="No auto-posting — you paste it into Google."
          />
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="mx-auto w-full max-w-5xl scroll-mt-20 px-4 py-16 sm:px-6"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight">
            How it works
          </h2>
          <p className="max-w-md text-muted-foreground text-pretty">
            Three small steps. The review reads like you wrote it.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          <Step
            n={1}
            tint="sage"
            icon={<PenLine />}
            title="Tell us about your visit"
            body="Tap through a few quick questions — what you got, what stood out. No essay required."
          />
          <Step
            n={2}
            tint="terracotta"
            icon={<span className="font-heading text-lg italic">A</span>}
            title="We write it in your voice"
            body="One honest, natural review — built only from your answers, tone matched to your rating."
          />
          <Step
            n={3}
            tint="gold"
            icon={<Copy />}
            title="Copy, post, done"
            body="Edit if you like, then copy it into Google and set your stars. You always post it yourself."
          />
        </div>
      </section>

      {/* Integrity */}
      <section className="mx-auto w-full max-w-2xl px-4 pb-20 text-center">
        <p className="text-sm text-muted-foreground text-balance">
          Only your words — no invented details. Honest ratings, good or bad. The
          review is yours, and you&apos;re the one who posts it.
        </p>
      </section>
    </main>
  );
}

function Feature({
  icon,
  tint,
  title,
  body,
}: {
  icon: React.ReactNode;
  tint: Tint;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col items-start gap-2">
      <div
        className={cn(
          "flex size-10 items-center justify-center rounded-xl [&_svg]:size-5",
          tintTile[tint],
        )}
      >
        {icon}
      </div>
      <h3 className="font-heading text-base font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground text-pretty">{body}</p>
    </div>
  );
}

function Step({
  n,
  tint,
  icon,
  title,
  body,
}: {
  n: number;
  tint: Tint;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="relative flex flex-col gap-3 rounded-2xl bg-card p-6 shadow-soft ring-1 ring-border/70">
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex size-11 items-center justify-center rounded-2xl [&_svg]:size-5",
            tintTile[tint],
          )}
        >
          {icon}
        </div>
        <span className="font-heading text-3xl font-semibold text-muted-foreground/30">
          {n}
        </span>
      </div>
      <h3 className="font-heading text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground text-pretty">{body}</p>
    </div>
  );
}

/** Illustrative product preview — purely decorative. */
function SampleReviewCard() {
  return (
    <div aria-hidden="true" className="mx-auto w-full max-w-sm select-none">
      <div className="overflow-hidden rounded-3xl bg-card shadow-lift ring-1 ring-border/70">
        <div className="relative h-44 bg-gradient-to-br from-sage/45 via-wheat/50 to-terracotta/30">
          <div className="absolute top-6 right-8 size-14 rounded-full bg-gold/70" />
          <div className="absolute right-16 bottom-0 h-20 w-px bg-sage-deep/20" />
          <div className="absolute right-6 bottom-0 h-28 w-px bg-sage-deep/20" />
        </div>
        <div className="flex flex-col gap-3 p-5">
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <LeafIcon className="size-5" />
            </span>
            <div className="flex flex-col">
              <span className="font-heading text-lg leading-tight font-semibold">
                Maple &amp; Moss Café
              </span>
              <span className="text-sm text-muted-foreground">
                Coffee shop · $$
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">4.6</span>
            <StarDisplay value={5} size={15} />
            <span className="text-muted-foreground">(238)</span>
          </div>
          <div className="mt-1 grid grid-cols-3 gap-2">
            <ActionChip tint="sage" icon={<PenLine />} label="Answer" />
            <ActionChip tint="gold" icon={<Star />} label="Review" />
            <ActionChip
              tint="terracotta"
              icon={<span className="font-heading text-sm font-bold">G</span>}
              label="Post"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionChip({
  tint,
  icon,
  label,
}: {
  tint: Tint;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl bg-secondary/60 py-3">
      <span
        className={cn(
          "flex size-8 items-center justify-center rounded-full [&_svg]:size-4",
          tintTile[tint],
        )}
      >
        {icon}
      </span>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  );
}
