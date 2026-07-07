// Gallery — the full masonry grid + lightbox. Portfolio only (no price/sold).
import { useState } from "react";
import { useData, type Gallery as GalleryData } from "../lib/useData";
import type { Page } from "../nav";
import { GalleryGrid } from "../ui/GalleryGrid";
import { Lightbox } from "../ui/Lightbox";

const EMPTY: GalleryData = { pieces: [] };

export function Gallery({ nav }: { nav: (p: Page) => void }) {
  const gallery = useData<GalleryData>("/content/gallery.json", EMPTY);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const openById = (id: string) => {
    const i = gallery.pieces.findIndex((p) => p.id === id);
    if (i >= 0) setOpenIndex(i);
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
      <header className="mb-8">
        <p className="eyebrow">Portfolio</p>
        <h1 className="mt-2 text-h1">The gallery</h1>
        <p className="mt-3 max-w-prose text-ink-soft text-pretty">
          Every piece is a hand-painted commission. Browse by kind, then order your own.
        </p>
      </header>

      {gallery.pieces.length === 0 ? (
        <p className="text-ink-faint">Gallery coming soon.</p>
      ) : (
        <GalleryGrid pieces={gallery.pieces} onOpen={openById} />
      )}

      {openIndex !== null && (
        <Lightbox
          pieces={gallery.pieces}
          index={openIndex}
          onIndex={setOpenIndex}
          onClose={() => setOpenIndex(null)}
          onOrder={() => {
            setOpenIndex(null);
            nav("order");
          }}
        />
      )}
    </div>
  );
}
