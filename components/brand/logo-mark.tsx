import { cn } from "@/lib/utils";

/**
 * Easy Reviews brand mark — an olive aster/sunburst of thin petals.
 * Monochrome: inherits the current text color via `fill-current`.
 */
export function LogoMark({ className }: { className?: string }) {
  const petals = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-6", className)}
      aria-hidden="true"
      focusable="false"
    >
      <g className="fill-current">
        {petals.map((deg) => (
          <ellipse
            key={deg}
            cx="12"
            cy="5.3"
            rx="1.3"
            ry="4.15"
            transform={`rotate(${deg} 12 12)`}
          />
        ))}
        <circle cx="12" cy="12" r="2.5" />
      </g>
    </svg>
  );
}
