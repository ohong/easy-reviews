import { LogoMark } from "@/components/brand/logo-mark";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-paper/60">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="flex items-center gap-2">
          <LogoMark className="size-4 text-sage" />
          <span>Honest reviews, in your words — you always post them yourself.</span>
        </p>
        <p>Not affiliated with Google.</p>
      </div>
    </footer>
  );
}
