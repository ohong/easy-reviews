"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-5 px-4 py-20 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-terracotta-tint text-terracotta">
        <TriangleAlert className="size-7" />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="text-sm text-muted-foreground text-pretty">
          An unexpected error occurred. Please try again.
        </p>
      </div>
      <Button size="lg" onClick={reset}>
        Try again
      </Button>
    </main>
  );
}
