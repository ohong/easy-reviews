import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/brand/logo-mark";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-heading text-xl font-semibold tracking-tight text-foreground"
        >
          <LogoMark className="size-7 text-primary" />
          Easy Reviews
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            className="hidden sm:inline-flex"
            render={<Link href="/#how-it-works" />}
          >
            How it works
          </Button>
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/for-business" />}
          >
            For businesses
          </Button>
        </nav>
      </div>
    </header>
  );
}
