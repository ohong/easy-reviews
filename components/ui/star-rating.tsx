"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  value,
  onChange,
  size = 44,
  label = "Overall rating",
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  label?: string;
}) {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  const interactive = Boolean(onChange);

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="flex items-center justify-center gap-1.5"
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          disabled={!interactive}
          onMouseEnter={() => interactive && setHover(n)}
          onMouseLeave={() => interactive && setHover(0)}
          onFocus={() => interactive && setHover(n)}
          onBlur={() => interactive && setHover(0)}
          onClick={() => onChange?.(n)}
          className={cn(
            "rounded-md p-1 transition-transform",
            interactive &&
              "cursor-pointer hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
          )}
        >
          <Star
            style={{ width: size, height: size }}
            className={cn(
              "transition-colors",
              n <= active
                ? "fill-gold text-gold"
                : "fill-transparent text-muted-foreground/30",
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function StarDisplay({
  value,
  size = 18,
}: {
  value: number;
  size?: number;
}) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          style={{ width: size, height: size }}
          className={cn(
            n <= value
              ? "fill-gold text-gold"
              : "fill-transparent text-muted-foreground/30",
          )}
        />
      ))}
    </div>
  );
}
