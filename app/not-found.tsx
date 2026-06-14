import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/brand/logo-mark";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-5 px-4 py-20 text-center">
      <LogoMark className="size-10 text-sage" />
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          We couldn&apos;t find that
        </h1>
        <p className="text-sm text-muted-foreground text-pretty">
          That business or page isn&apos;t available. Start from the top?
        </p>
      </div>
      <Button size="lg" nativeButton={false} render={<Link href="/" />}>
        Back home
      </Button>
    </main>
  );
}
