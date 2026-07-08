// Masonry gallery grid with painted-tab category filters. Tiles vary in true
// aspect ratio and float frameless on the paper. Tapping a tile calls onOpen
// (the Gallery page wires that to the lightbox). Thumbs are path-referenced per
// the locked image decision; tiles without one fall back to painterly stand-ins.
import { useState } from "react";
import { GalleryCard, type Piece } from "./GalleryCard";

const CATEGORIES = ["All", "Dogs", "Cats", "Artwork", "Studies"] as const;
type Category = (typeof CATEGORIES)[number];

export function GalleryGrid({
  pieces,
  onOpen,
}: {
  pieces: Piece[];
  onOpen?: (id: string) => void;
}) {
  const [active, setActive] = useState<Category>("All");
  const shown = active === "All" ? pieces : pieces.filter((p) => p.category === active);

  return (
    <div>
      {/* Painted-tab filter chips. */}
      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const on = c === active;
          return (
            <button
              key={c}
              onClick={() => setActive(c)}
              aria-pressed={on}
              className={
                "relative px-3 py-1.5 font-body text-sm font-semibold transition-colors " +
                (on ? "text-ink" : "text-ink-faint hover:text-ink-soft")
              }
            >
              {on ? <span className="brush-underline">{c}</span> : c}
            </button>
          );
        })}
      </div>

      {/* CSS-columns masonry — order-independent, keeps true aspect ratios.
          Empty category → a friendly "coming soon" instead of a blank void. */}
      {shown.length === 0 ? (
        <div className="py-12 text-center text-ink-faint">
          <p>More {active.toLowerCase()} coming soon.</p>
        </div>
      ) : (
        <div className="[column-fill:_balance] gap-5 columns-2 sm:columns-3 lg:columns-4">
          {shown.map((p) => (
            <GalleryCard key={p.id} piece={p} onOpen={onOpen} />
          ))}
        </div>
      )}
    </div>
  );
}
