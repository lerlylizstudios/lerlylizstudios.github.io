// Home — hero (stroke motif + one featured portrait, not a splash field), the
// Order module, a 6-tile gallery teaser → Gallery, and an Instagram invite.
import { useData, type Gallery } from "../lib/useData";
import type { Page } from "../nav";
import { SITE } from "../lib/site";
import { OrderModule } from "../ui/OrderModule";
import { PieceFrame } from "../ui/GalleryCard";
import { PaintIn } from "../art/PaintIn";
import { EdgeBleed } from "../art/EdgeBleed";
import { HatchSet, CommaDab, BrokenStroke } from "../art/svg";

const EMPTY: Gallery = { pieces: [] };

export function Home({ nav, commissionsOpen }: { nav: (p: Page) => void; commissionsOpen: boolean }) {
  const gallery = useData<Gallery>("/content/gallery.json", EMPTY);
  const featured =
    gallery.pieces.find((p) => p.id === gallery.featuredId) ?? gallery.pieces.find((p) => p.thumb);
  const teaser = gallery.pieces.filter((p) => p.thumb).slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-6">
      {/* Hero */}
      <section className="grid items-center gap-8 py-12 sm:py-16 md:grid-cols-2 md:gap-12">
        <div className="relative">
          <p className="eyebrow">Hand-painted pet portraits</p>
          <h1 className="mt-3 text-display">
            Your pet, in <span className="brush-underline">bold color</span>
          </h1>
          <p className="mt-5 max-w-prose text-lede text-ink-soft text-pretty">
            {SITE.statement}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a className="btn-primary" href={SITE.etsyListing} target="_blank" rel="noreferrer">
              Order on Etsy — {SITE.price}
            </a>
            <button className="btn-ghost" onClick={() => nav("gallery")}>
              See the gallery
            </button>
          </div>
        </div>

        {/* Featured portrait — stroke accents, no splash field. */}
        {featured && (
          <div className="relative mx-auto w-full max-w-sm">
            <EdgeBleed edge="tr" size={130} rotate={22} opacity={0.9}>
              <HatchSet color="var(--coral)" />
            </EdgeBleed>
            <EdgeBleed edge="bl" size={110} rotate={-14} opacity={0.85}>
              <BrokenStroke color="var(--cobalt)" />
            </EdgeBleed>
            <EdgeBleed edge="br" size={70} rotate={40} opacity={0.9}>
              <CommaDab color="var(--marigold)" />
            </EdgeBleed>
            <PieceFrame piece={featured} size="full" className="relative z-10" />
          </div>
        )}
      </section>

      {/* Order module */}
      <PaintIn as="section" className="py-6">
        <OrderModule open={commissionsOpen} />
      </PaintIn>

      {/* Gallery teaser */}
      {teaser.length > 0 && (
        <section className="py-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-h2">Recent work</h2>
            <button className="btn-ghost" onClick={() => nav("gallery")}>
              See all
            </button>
          </div>
          <div className="[column-fill:_balance] columns-2 gap-4 sm:columns-3">
            {teaser.map((p) => (
              <figure key={p.id} className="mb-4 break-inside-avoid">
                <PieceFrame piece={p} onOpen={() => nav("gallery")} />
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Instagram invite */}
      <section className="pb-16">
        <a
          href={SITE.instagram}
          target="_blank"
          rel="noreferrer"
          className="frame flex items-center justify-between gap-4 px-6 py-5 hover:shadow-lift"
        >
          <span className="font-display text-h3">See more on Instagram</span>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-coral-deep">
            @lerly_lizstudio →
          </span>
        </a>
      </section>
    </div>
  );
}
