// Home — hero (stroke motif + the transparent hero painting, not a splash
// field), the Order module, a 6-tile gallery teaser → Gallery, and an
// Instagram invite.
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
            <a className="btn-primary" href={SITE.etsyListing} target="_blank" rel="noopener noreferrer">
              Order on Etsy — {SITE.price}
            </a>
            <button className="btn-ghost" onClick={() => nav("gallery")}>
              See the gallery
            </button>
          </div>
        </div>

        {/* Hero art — a transparent PNG, so no frame/box-shadow (those draw a
            rectangle around the empty corners). drop-shadow follows the painted
            shapes. The stroke accents sit behind (z-0); the % offsets tuck each
            one under a painting corner so it peeks out instead of floating in
            the transparent margin. */}
        <div className="relative mx-auto w-full max-w-lg">
          <EdgeBleed edge="tr" size={130} rotate={22} opacity={0.9} className="!top-[16%]">
            <HatchSet color="var(--coral)" />
          </EdgeBleed>
          <EdgeBleed edge="bl" size={110} rotate={-14} opacity={0.85} className="!left-[11%]">
            <BrokenStroke color="var(--cobalt)" />
          </EdgeBleed>
          <EdgeBleed edge="br" size={70} rotate={40} opacity={0.9} className="!bottom-[15%] !right-[4%]">
            <CommaDab color="var(--marigold)" />
          </EdgeBleed>
          {/* Source: original artwork by Lerly Liz Studios */}
          <img
            src="/paintings/hero-bulldog-portraits.png"
            alt="Two hand-painted acrylic dog portraits: a smiling pink-and-white French bulldog in a white mat, and a wrinkly-faced dog in a red crab costume with googly eyes on a blue background."
            width={1024}
            height={768}
            className="relative z-10 h-auto w-full object-contain drop-shadow-[0_14px_18px_rgba(120,80,50,0.3)]"
          />
        </div>
      </section>

      {/* Order module (already its own <section>) */}
      <PaintIn className="py-6">
        <OrderModule open={commissionsOpen} />
      </PaintIn>

      {/* Gallery teaser */}
      {teaser.length > 0 && (
        <section className="py-14">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
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
          rel="noopener noreferrer"
          className="frame flex flex-wrap items-center justify-between gap-4 px-6 py-5 hover:shadow-lift"
        >
          <h2 className="font-display text-h3">See more on Instagram</h2>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-coral-deep">
            {SITE.instagramHandle} →
          </span>
        </a>
      </section>
    </div>
  );
}
