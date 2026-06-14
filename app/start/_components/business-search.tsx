"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchBusinessesAction } from "../actions";
import type { PlaceSuggestion } from "@/lib/places";

export function BusinessSearch({
  initialQuery = "",
  onPick,
}: {
  initialQuery?: string;
  /** Defaults to navigating into the review flow for the chosen place. */
  onPick?: (suggestion: PlaceSuggestion) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<PlaceSuggestion[]>([]);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      startTransition(async () => {
        const res = await searchBusinessesAction(q);
        if (res.ok) {
          setResults(res.suggestions);
          setError(null);
        } else {
          setError(res.error);
          setResults([]);
        }
      });
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  function pick(s: PlaceSuggestion) {
    if (onPick) onPick(s);
    else router.push(`/review/${encodeURIComponent(s.placeId)}`);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Search input */}
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a business by name"
          aria-label="Search for a business"
          className="h-12 pl-10 text-base"
        />
        {pending && (
          <Loader2 className="absolute top-1/2 right-3.5 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Error state */}
      {error && (
        <p className="px-1 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {/* Results list */}
      {results.length > 0 && (
        <ul className="overflow-hidden rounded-2xl bg-card shadow-soft ring-1 ring-border/70">
          {results.map((s) => (
            <li key={s.placeId} className="border-b border-border/50 last:border-b-0">
              <button
                type="button"
                onClick={() => pick(s)}
                className="flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-secondary"
              >
                {/* Avatar tile */}
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-sage-tint text-sage-deep">
                  <MapPin className="size-4" />
                </span>
                <span className="flex flex-col">
                  <span className="font-medium text-foreground">{s.mainText}</span>
                  {s.secondaryText && (
                    <span className="text-sm text-muted-foreground">
                      {s.secondaryText}
                    </span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Empty state */}
      {query.trim().length >= 2 && !pending && results.length === 0 && !error && (
        <p className="px-1 text-sm text-muted-foreground">
          No matches yet — keep typing.
        </p>
      )}
    </div>
  );
}
