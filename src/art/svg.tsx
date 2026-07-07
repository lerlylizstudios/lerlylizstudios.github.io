// Hand-authored SVG art library — STROKES, not splashes. This mirrors how the
// work is actually painted: dense, tapered mark-making, broken skipping
// outlines, directional hatching, and sparse unexpected accent strokes. No
// smooth vector blobs. Shapes tint via `currentColor` / the `color` prop.

type ArtProps = {
  className?: string;
  /** CSS color; drives currentColor. */
  color?: string;
  style?: React.CSSProperties;
};

const base = (p: ArtProps, extra?: React.CSSProperties) => ({
  className: p.className,
  style: { color: p.color, ...extra, ...p.style },
  "aria-hidden": true as const,
  focusable: false,
  xmlns: "http://www.w3.org/2000/svg",
});

/** Short tapered comma flick — thick-to-thin. Her core mark; cluster to build form. */
export function CommaDab(p: ArtProps) {
  return (
    <svg viewBox="0 0 40 40" {...base(p)}>
      <path
        fill="currentColor"
        d="M6 12c3-6 12-9 20-6 6 2 9 6 8 8-1 3-6 2-11 1 4 2 8 6 6 10-2 5-9 6-14 3-6-3-12-11-9-16Z"
      />
    </svg>
  );
}

/** A tiny highlight fleck — usually white, dropped on top of built-up form. */
export function Fleck(p: ArtProps) {
  return (
    <svg viewBox="0 0 20 20" {...base(p)}>
      <path fill="currentColor" d="M3 8c2-4 8-6 12-4 3 2 2 5-2 6-5 1-5 4-8 3s-3-3-2-5Z" />
    </svg>
  );
}

/** A loose, broken outline that skips rather than running continuous. */
export function BrokenStroke(p: ArtProps) {
  return (
    <svg viewBox="0 0 100 100" {...base(p)}>
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 30c4-9 14-15 26-14 8 1 15 5 20 12" strokeWidth="5" strokeDasharray="34 7 20 9" />
        <path d="M70 34c8 9 11 22 6 33-3 7-9 12-16 15" strokeWidth="4" strokeDasharray="26 8 15 6" />
        <path d="M56 84c-13 4-27 0-34-11" strokeWidth="5" strokeDasharray="22 9 14" />
        <path d="M18 66c-3-8-2-17 2-24" strokeWidth="3.5" strokeDasharray="18 7 10" />
      </g>
    </svg>
  );
}

/** Directional hatch-set — parallel strokes following the form, weight varying. */
export function HatchSet(p: ArtProps) {
  return (
    <svg viewBox="0 0 60 60" {...base(p)}>
      <g stroke="currentColor" strokeLinecap="round" fill="none">
        <path d="M8 46 L30 12" strokeWidth="4.5" />
        <path d="M16 50 L37 17" strokeWidth="3" />
        <path d="M24 51 L44 22" strokeWidth="5" />
        <path d="M33 52 L50 27" strokeWidth="2.5" />
        <path d="M41 50 L54 33" strokeWidth="4" />
      </g>
    </svg>
  );
}

/** Vivid eye — broken dark ring, colored iris, white catchlight. Her signature. */
export function Eye({ iris = "var(--marigold)", ...p }: ArtProps & { iris?: string }) {
  return (
    <svg viewBox="0 0 60 40" {...base(p)}>
      <circle cx="30" cy="20" r="15" fill={iris} />
      <circle cx="30" cy="20" r="8" fill="#241E1B" />
      <circle cx="26" cy="16" r="3.2" fill="#fff" />
      <g fill="none" stroke="#241E1B" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="16 6 10 7">
        <ellipse cx="30" cy="20" rx="17" ry="13" />
      </g>
    </svg>
  );
}

/**
 * ScribbleField — a loose parallel/crosshatch color field in ONE accent hue,
 * cream paper showing through the gaps. This is the "scribbled color behind a
 * subject" motif; use it wherever a splash-field used to sit, bleeding off an
 * edge. Strokes are deterministically jittered so no two lines match.
 */
type Stroke = { d: string; w: number; o: number };
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function buildField(seed: number, count: number, angle: number): Stroke[] {
  const rnd = mulberry32(seed);
  const out: Stroke[] = [];
  const rad = (angle * Math.PI) / 180;
  const dx = Math.cos(rad) * 90;
  const dy = Math.sin(rad) * 90;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    // march perpendicular to the stroke direction across the field
    const px = t * 150 - 25 + (rnd() - 0.5) * 10;
    const py = t * -40 + 70 + (rnd() - 0.5) * 12;
    const sx = px - dx / 2;
    const sy = py - dy / 2;
    const ex = px + dx / 2;
    const ey = py + dy / 2;
    const bend = (rnd() - 0.5) * 22;
    const mx = (sx + ex) / 2 + Math.sin(rad) * bend;
    const my = (sy + ey) / 2 - Math.cos(rad) * bend;
    out.push({
      d: `M${sx.toFixed(1)} ${sy.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`,
      w: 2 + rnd() * 4,
      o: 0.55 + rnd() * 0.45,
    });
  }
  return out;
}
const FIELD_A = buildField(7, 15, -22);
const FIELD_B = buildField(42, 13, 28);

export function ScribbleField({
  color,
  cross = false,
  className = "",
  style,
}: ArtProps & { cross?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 100"
      preserveAspectRatio="xMidYMid slice"
      {...base({ color, className, style })}
    >
      <g stroke="currentColor" fill="none" strokeLinecap="round">
        {FIELD_A.map((s, i) => (
          <path key={`a${i}`} d={s.d} strokeWidth={s.w} opacity={s.o} />
        ))}
        {cross &&
          FIELD_B.map((s, i) => (
            <path key={`b${i}`} d={s.d} strokeWidth={s.w * 0.8} opacity={s.o * 0.7} />
          ))}
      </g>
    </svg>
  );
}

/** Reusable grain filter def — drop once per page. */
export function GrainDefs() {
  return (
    <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
      <filter id="ll-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n" />
        <feColorMatrix in="n" type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.55" />
        </feComponentTransfer>
      </filter>
    </svg>
  );
}

/** Fixed, non-interactive paper grain. */
export function Grain({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none fixed inset-0 z-50 opacity-[0.06] mix-blend-multiply ${className}`}>
      <svg width="100%" height="100%">
        <rect width="100%" height="100%" filter="url(#ll-grain)" />
      </svg>
    </div>
  );
}
