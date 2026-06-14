"use client";

import { useActionState } from "react";
import { ArrowRight, Link2, QrCode, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resolveUrlAction } from "@/app/actions";

export function PasteForm() {
  const [state, action, pending] = useActionState(resolveUrlAction, null);

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-4 shadow-card ring-1 ring-border/70 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <Link2 className="size-4 text-primary" />
          Paste Google Maps URL
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <QrCode className="size-3.5" />
          or scan a QR
        </span>
      </div>

      <form action={action} className="flex flex-col gap-2.5">
        <Input
          name="url"
          type="text"
          inputMode="url"
          autoComplete="off"
          aria-label="Google Maps link or business name"
          placeholder="https://maps.app.goo.gl/…  or a business name"
          className="h-12 text-base"
        />
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="h-12 w-full text-[0.95rem]"
        >
          {pending ? (
            "Finding…"
          ) : (
            <>
              Start in 45 sec
              <ArrowRight />
            </>
          )}
        </Button>
        {state?.error && (
          <p className="text-sm text-destructive" role="alert">
            {state.error}
          </p>
        )}
      </form>

      <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="size-3.5" />
        No account. No AI posting. You&apos;re in control.
      </p>
    </div>
  );
}
