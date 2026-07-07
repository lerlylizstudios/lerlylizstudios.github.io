// Dev-only /styleguide — visual proof of the wet-canvas design system. Motif is
// expressive STROKE mark-making (not splashes): tapered dabs, broken outlines,
// hatch-sets, vivid eyes, and scribbled color fields, kept legible by calm
// frames and dominant paper. Renders every primitive plus the gallery preview.
import { CANVAS, INK, PIGMENTS, type Pigment } from "../lib/palette";
import {
  GrainDefs, Grain, CommaDab, Fleck, BrokenStroke, HatchSet, Eye, ScribbleField,
} from "../art/svg";
import { EdgeBleed } from "../art/EdgeBleed";
import { PaintIn } from "../art/PaintIn";
import { CommissionBadge } from "../ui/CommissionBadge";
import { OrderModule } from "../ui/OrderModule";
import { GalleryGrid } from "../ui/GalleryGrid";
import type { Piece } from "../ui/GalleryCard";

// Tiny real-piece sample just to demo the grid + a placeholder tile here in the
// styleguide. The live Gallery reads the full set from content/gallery.json.
const SAMPLE_PIECES: Piece[] = [
  { id: "apollo", title: "Apollo", category: "Dogs", ratio: 0.84, tint: "var(--violet)", thumb: "/paintings/apollo-thumb.webp", full: "/paintings/apollo-full.webp" },
  { id: "dog2", title: "Marmalade", category: "Cats", ratio: 0.9, tint: "var(--coral)", thumb: "/paintings/dog2-thumb.webp", full: "/paintings/dog2-full.webp" },
  { id: "dog3", title: "Blue", category: "Dogs", ratio: 0.8, tint: "var(--teal)", thumb: "/paintings/dog3-thumb.webp", full: "/paintings/dog3-full.webp" },
  { id: "sample-placeholder", title: "Placeholder", category: "Studies", ratio: 1, tint: "var(--fuchsia)" },
];

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-8">
      <h2 className="eyebrow mb-4 border-b border-canvas-edge pb-2">{title}</h2>
      {children}
    </section>
  );
}

function Swatch({ p }: { p: Pigment }) {
  return (
    <div className="frame overflow-hidden">
      <div className="h-16" style={{ background: p.value }} />
      {p.deep && <div className="h-4" style={{ background: p.deep }} />}
      <div className="px-3 py-2">
        <div className="font-body text-sm font-semibold">{p.name}</div>
        <div className="text-xs text-ink-faint">{p.role}</div>
        <div className="mt-1 font-mono text-[0.7rem] text-ink-soft">{p.value}</div>
      </div>
    </div>
  );
}

export default function StyleGuide() {
  return (
    <div className="relative min-h-screen">
      <GrainDefs />
      <Grain />

      <header className="relative overflow-hidden border-b border-canvas-edge">
        <div className="pointer-events-none absolute -right-16 -top-16 h-80 w-96 opacity-70">
          <ScribbleField color="var(--coral)" cross className="h-full w-full" />
        </div>
        <EdgeBleed edge="l" size={200} rotate={-8} opacity={0.6}>
          <HatchSet color="var(--cobalt)" />
        </EdgeBleed>
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-16">
          <p className="eyebrow">Lerly Liz Studios · Design system</p>
          <h1 className="mt-3 text-display">
            The <span className="brush-underline">wet canvas</span>
          </h1>
          <p className="mt-4 max-w-prose text-lede text-ink-soft text-pretty">
            Dense, expressive mark-making — tapered dabs, broken outlines, and
            scribbled color — kept legible by calm frames and dominant paper.
            Chaos into clarity.
          </p>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl space-y-16 px-6 py-16">
        {/* ---- Palette ---- */}
        <Section id="palette" title="Palette tokens">
          <div className="space-y-6">
            <div>
              <div className="eyebrow mb-2 !text-ink-faint">Canvas &amp; ink</div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
                {[...CANVAS, ...INK].map((p) => <Swatch key={p.name} p={p} />)}
              </div>
            </div>
            <div>
              <div className="eyebrow mb-2 !text-ink-faint">Pigments</div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
                {PIGMENTS.map((p) => <Swatch key={p.name} p={p} />)}
              </div>
            </div>
          </div>
        </Section>

        {/* ---- Type scale ---- */}
        <Section id="type" title="Type scale — Fraunces / Hanken Grotesk / Caveat">
          <div className="space-y-4">
            <p className="text-display font-display">Display · Fraunces</p>
            <h1 className="text-h1 font-display">Heading 1 — hand-painted personality</h1>
            <h2 className="text-h2 font-display">Heading 2 — rich texture &amp; movement</h2>
            <h3 className="text-h3 font-display">Heading 3 — a calm frame</h3>
            <p className="text-lede text-ink-soft">
              Lede · Hanken Grotesk — the warm humanist body voice, sized for a
              comfortable read across a full measure of text.
            </p>
            <p className="max-w-prose text-ink-soft">
              Body · Hanken Grotesk — the workhorse. Vibrant, expressive pet
              portraits using bold brushstrokes and unexpected color to capture
              not just how a pet looks, but who they are.
            </p>
            <p className="eyebrow">Eyebrow · uppercase</p>
            <p className="font-script text-3xl text-coral-deep">Caveat — a signed, painterly aside</p>
          </div>
        </Section>

        {/* ---- Stroke library ---- */}
        <Section id="marks" title="Mark-making library">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { label: "CommaDab", el: <CommaDab color="var(--coral)" /> },
              { label: "Fleck", el: <Fleck color="var(--ink)" /> },
              { label: "BrokenStroke", el: <BrokenStroke color="var(--ink)" /> },
              { label: "HatchSet", el: <HatchSet color="var(--teal)" /> },
              { label: "Eye", el: <Eye iris="var(--marigold)" /> },
              { label: "Dab cluster", el: <DabCluster /> },
            ].map((a) => (
              <div key={a.label} className="frame flex flex-col items-center gap-2 p-4">
                <div className="flex h-20 w-full items-center justify-center">{a.el}</div>
                <span className="eyebrow text-center">{a.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-ink-faint">
            Paper grain is active page-wide. Accents stay sparse — the motif never fills the content.
          </p>
        </Section>

        {/* ---- ScribbleField ---- */}
        <Section id="scribble" title="ScribbleField — loose color behind the subject">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { hue: "var(--fuchsia)", cross: false, label: "single hue" },
              { hue: "var(--teal)", cross: true, label: "crosshatch" },
              { hue: "var(--cobalt)", cross: false, label: "bleeds off edge" },
            ].map((f, i) => (
              <div key={i} className="relative h-40 overflow-hidden rounded-frame bg-canvas ring-1 ring-ink/10">
                <ScribbleField color={f.hue} cross={f.cross} className="absolute inset-0 h-full w-full opacity-75" />
                <span className="absolute bottom-2 left-3 z-10 font-script text-xl">{f.label}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ---- Edge-bleed placement ---- */}
        <Section id="edgebleed" title="Edge-bleed — fields & stroke-clusters spill past the frame">
          <div className="relative h-56 overflow-hidden rounded-frame bg-canvas ring-1 ring-ink/10">
            <div className="pointer-events-none absolute -left-8 -top-8 h-44 w-56 opacity-70">
              <ScribbleField color="var(--marigold)" className="h-full w-full" />
            </div>
            <EdgeBleed edge="tr" size={150} rotate={25}><HatchSet color="var(--fuchsia)" /></EdgeBleed>
            <EdgeBleed edge="br" size={120} rotate={-20}><BrokenStroke color="var(--cobalt)" /></EdgeBleed>
            <EdgeBleed edge="bl" size={90} rotate={12}><CommaDab color="var(--teal)" /></EdgeBleed>
            <div className="relative z-10 flex h-full items-center justify-center">
              <span className="frame px-4 py-2 font-script text-2xl">clarity holds the center</span>
            </div>
          </div>
        </Section>

        {/* ---- Scroll paint-in ---- */}
        <Section id="paintin" title="Scroll paint-in (no observer · reduced-motion pre-paints)">
          <div className="space-y-3">
            {["one", "two", "three", "four"].map((n, i) => (
              <PaintIn key={n} delay={i * 0.04} className="frame p-5">
                <p className="text-lede">Row {n} paints in on scroll via a pure CSS scroll timeline.</p>
              </PaintIn>
            ))}
          </div>
        </Section>

        {/* ---- Buttons + badge ---- */}
        <Section id="buttons" title="Buttons & commission badge">
          <div className="flex flex-wrap items-center gap-3">
            <button className="btn-primary">Order on Etsy — $35</button>
            <button className="btn-ink">Join the waitlist</button>
            <button className="btn-ghost">Visit the shop</button>
            <button className="btn-primary" disabled>Disabled</button>
          </div>
          <div className="mt-4 flex flex-wrap gap-4">
            <CommissionBadge open />
            <CommissionBadge open={false} />
          </div>
        </Section>

        {/* ---- Order module ---- */}
        <Section id="order" title="Order module (reused: Home + Order view)">
          <div className="space-y-8">
            <OrderModule open />
            <OrderModule open={false} />
          </div>
        </Section>

        {/* ---- Gallery preview ---- */}
        <Section id="gallery" title="Gallery — masonry preview (sample)">
          <p className="mb-6 max-w-prose text-sm text-ink-faint">
            Frameless-on-paper: portraits float with a soft warm shadow + hair-thin edge,
            true aspect ratios, painted-tab filters. A few real pieces plus one placeholder
            tile; the live Gallery reads the full set from content/gallery.json.
          </p>
          <GalleryGrid pieces={SAMPLE_PIECES} />
        </Section>
      </main>
    </div>
  );
}

/** A cluster of overlapping tapered dabs — shows how marks build form. */
function DabCluster() {
  const dabs = [
    { c: "var(--coral)", x: 2, y: 8, r: -20, s: 0.9 },
    { c: "var(--marigold)", x: 22, y: 2, r: 15, s: 1 },
    { c: "var(--fuchsia)", x: 12, y: 24, r: 60, s: 0.8 },
    { c: "var(--violet)", x: 34, y: 20, r: -40, s: 0.7 },
    { c: "var(--teal)", x: 40, y: 6, r: 30, s: 0.6 },
  ];
  return (
    <div className="relative h-16 w-16">
      {dabs.map((d, i) => (
        <div key={i} className="absolute h-8 w-8" style={{ left: d.x, top: d.y, transform: `rotate(${d.r}deg) scale(${d.s})` }}>
          <CommaDab color={d.c} />
        </div>
      ))}
    </div>
  );
}
