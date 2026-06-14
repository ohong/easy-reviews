import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * Retro-botanical decorations — flat, warm, slightly stylised plant
 * illustrations that frame the page edges (see design/ mockups).
 * Each piece is a self-contained <svg>; size it with a w-/h- className.
 * Colors come from the palette tokens so they re-theme automatically.
 * ------------------------------------------------------------------ */

const PETAL_TERRACOTTA = "M0 0 C 10 -11, 10 -34, 0 -45 C -10 -34, -10 -11, 0 0 Z";
const PETAL_TERRACOTTA_INNER =
  "M0 -4 C 6 -13, 6 -27, 0 -34 C -6 -27, -6 -13, 0 -4 Z";
const PETAL_SUN = "M0 0 C 6 -14, 6 -42, 0 -54 C -6 -42, -6 -14, 0 0 Z";
const LEAF_BLADE = "M22 1 C 38 16, 40 46, 22 71 C 4 46, 6 16, 22 1 Z";

function ring(n: number) {
  return Array.from({ length: n }, (_, i) => (360 / n) * i);
}

/** A single leaf with a midrib + side veins. Blade fill via className. */
export function Leaf({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 72"
      className={cn("fill-sage", className)}
      aria-hidden="true"
      focusable="false"
    >
      <path d={LEAF_BLADE} />
      <g
        fill="none"
        className="stroke-[oklch(0.30_0.05_150_/_0.35)]"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <path d="M22 7 L22 66" />
        <path d="M22 24 C 28 24, 32 22, 35 18" />
        <path d="M22 36 C 28 36, 32 34, 35 30" />
        <path d="M22 24 C 16 24, 12 22, 9 18" />
        <path d="M22 36 C 16 36, 12 34, 9 30" />
      </g>
    </svg>
  );
}

/** A curved stem carrying several alternating leaves. */
export function LeafSprig({ className }: { className?: string }) {
  const leaves = [
    { x: 60, y: 14, r: 18, s: 0.7 },
    { x: 30, y: 40, r: -38, s: 0.85 },
    { x: 66, y: 58, r: 34, s: 0.8 },
    { x: 36, y: 86, r: -28, s: 1 },
  ];
  return (
    <svg
      viewBox="0 0 100 150"
      className={cn("text-sage", className)}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M50 150 C 46 110, 54 70, 50 18"
        fill="none"
        className="stroke-sage-deep"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {leaves.map((l, i) => (
        <g
          key={i}
          transform={`translate(${l.x} ${l.y}) rotate(${l.r}) scale(${l.s})`}
        >
          <path
            d={LEAF_BLADE}
            transform="translate(-22 -36)"
            className={i % 2 ? "fill-sage-deep" : "fill-sage"}
          />
        </g>
      ))}
    </svg>
  );
}

/** Gold sunflower with a seeded center and a pair of base leaves. */
export function Sunflower({ className }: { className?: string }) {
  const cx = 90;
  const cy = 84;
  return (
    <svg
      viewBox="0 0 180 184"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* base leaves */}
      <g transform="translate(90 132)">
        <path
          d={LEAF_BLADE}
          transform="translate(-22 -36) rotate(34 22 36)"
          className="fill-sage"
        />
        <path
          d={LEAF_BLADE}
          transform="translate(-22 -36) rotate(-34 22 36)"
          className="fill-sage-deep"
        />
      </g>
      {/* petals */}
      <g transform={`translate(${cx} ${cy})`}>
        {ring(16).map((a) => (
          <path
            key={a}
            d={PETAL_SUN}
            transform={`rotate(${a})`}
            className="fill-gold"
          />
        ))}
        {/* center */}
        <circle r="33" className="fill-[oklch(0.74_0.10_78)]" />
        <circle r="26" className="fill-[oklch(0.52_0.08_72)]" />
        <g className="fill-[oklch(0.40_0.06_70)]">
          {ring(10).map((a) => {
            const rad = (a * Math.PI) / 180;
            return (
              <circle
                key={`o-${a}`}
                cx={Math.cos(rad) * 18}
                cy={Math.sin(rad) * 18}
                r="2.4"
              />
            );
          })}
          {ring(6).map((a) => {
            const rad = ((a + 30) * Math.PI) / 180;
            return (
              <circle
                key={`i-${a}`}
                cx={Math.cos(rad) * 9}
                cy={Math.sin(rad) * 9}
                r="2.2"
              />
            );
          })}
          <circle r="2.2" />
        </g>
      </g>
    </svg>
  );
}

/** Terracotta bloom — rounded two-tone petals, gold eye, stem + leaves. */
export function TerracottaBloom({ className }: { className?: string }) {
  const cx = 85;
  const cy = 76;
  return (
    <svg
      viewBox="0 0 170 184"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* stem + leaves */}
      <path
        d="M85 180 C 82 150, 86 120, 85 92"
        fill="none"
        className="stroke-sage-deep"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <g transform="translate(85 150)">
        <path
          d={LEAF_BLADE}
          transform="translate(-22 -36) rotate(48 22 36) scale(0.9)"
          className="fill-sage"
        />
        <path
          d={LEAF_BLADE}
          transform="translate(-22 -36) rotate(-44 22 36) scale(0.8)"
          className="fill-sage-deep"
        />
      </g>
      {/* petals */}
      <g transform={`translate(${cx} ${cy})`}>
        {ring(7).map((a) => (
          <path
            key={a}
            d={PETAL_TERRACOTTA}
            transform={`rotate(${a})`}
            className="fill-terracotta"
          />
        ))}
        {ring(7).map((a) => (
          <path
            key={`in-${a}`}
            d={PETAL_TERRACOTTA_INNER}
            transform={`rotate(${a + 25})`}
            className="fill-[oklch(0.76_0.12_48)]"
          />
        ))}
        <circle r="16" className="fill-gold" />
        <circle r="16" className="fill-[oklch(0.40_0.06_70)]" opacity="0.18" />
        <g className="fill-[oklch(0.45_0.07_72)]">
          {ring(8).map((a) => {
            const rad = (a * Math.PI) / 180;
            return (
              <circle
                key={a}
                cx={Math.cos(rad) * 8}
                cy={Math.sin(rad) * 8}
                r="1.7"
              />
            );
          })}
        </g>
      </g>
    </svg>
  );
}

/**
 * Full-bleed botanical backdrop. Sits behind page content (-z-10), framing
 * the viewport corners the way the mockups do. Pure decoration.
 */
export function PageBotanicals({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      {/* bottom-left terracotta cluster */}
      <TerracottaBloom className="absolute -bottom-20 -left-16 w-52 rotate-[8deg] opacity-90 sm:w-64 md:w-72" />
      <LeafSprig className="absolute bottom-2 left-28 hidden w-20 rotate-[14deg] opacity-80 lg:block" />

      {/* right sunflower + leaves */}
      <Sunflower className="absolute -right-16 top-20 w-48 opacity-90 sm:w-60 md:-right-12 md:w-72" />
      <LeafSprig className="absolute right-2 top-1 hidden w-24 -scale-x-100 -rotate-[10deg] opacity-75 lg:block" />
      <Leaf className="absolute right-3 bottom-28 hidden w-16 rotate-[40deg] fill-sage opacity-70 md:block" />

      {/* top-left accent leaf */}
      <Leaf className="absolute -left-3 top-24 hidden w-14 -rotate-[18deg] fill-sage-deep opacity-60 lg:block" />
    </div>
  );
}
