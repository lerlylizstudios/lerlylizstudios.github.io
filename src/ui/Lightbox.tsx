// Gallery lightbox — focus-trapped dialog with arrow-key + swipe nav, Esc to
// close, caption (title + category), and an "Order a portrait like this" CTA.
// Portfolio only: no price or sold state. Reduced-motion users get no transition.
import { useEffect, useRef, useState } from "react";
import { useModal } from "../lib/useModal";
import { PieceVisual, type Piece } from "./GalleryCard";

export function Lightbox({
  pieces,
  index,
  onClose,
  onIndex,
  onOrder,
}: {
  pieces: Piece[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
  onOrder: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useModal(true, ref, onClose);
  const piece = pieces[index];
  const go = (delta: number) => onIndex((index + delta + pieces.length) % pieces.length);

  // Arrow-key navigation.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  // Swipe navigation.
  const touch = useState<number | null>(null);
  const [startX, setStartX] = touch;
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
    setStartX(null);
  };

  if (!piece) return null;

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={`${piece.title}, ${piece.category} portrait`}
      className="fixed inset-0 z-[60] flex flex-col bg-ink/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={(e) => setStartX(e.touches[0].clientX)}
      onTouchEnd={onTouchEnd}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 text-canvas">
        <span className="text-sm text-canvas/70">
          {index + 1} / {pieces.length}
        </span>
        <button
          onClick={onClose}
          aria-label="Close"
          className="rounded-full p-2 hover:bg-canvas/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-canvas"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      {/* Stage */}
      <div className="flex min-h-0 flex-1 items-center justify-center gap-2 px-2 sm:px-4">
        <NavArrow dir="prev" onClick={() => go(-1)} />
        <div className="flex max-h-full min-w-0 flex-col items-center">
          <div
            className="max-h-[68vh] overflow-hidden rounded-[3px] bg-canvas shadow-lift"
            style={{ aspectRatio: String(piece.ratio), maxWidth: `min(92vw, calc(68vh * ${piece.ratio}))` }}
          >
            <PieceVisual piece={piece} size="full" />
          </div>
          <figcaption className="mt-4 text-center text-canvas">
            <span className="font-display text-h3">{piece.title}</span>
            <span className="ml-2 text-sm text-canvas/60">{piece.category}</span>
          </figcaption>
        </div>
        <NavArrow dir="next" onClick={() => go(1)} />
      </div>

      {/* Order CTA */}
      <div className="flex justify-center px-4 pb-6 pt-3">
        <button className="btn-primary" onClick={onOrder}>
          Order a portrait like this — $35
        </button>
      </div>
    </div>
  );
}

function NavArrow({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous" : "Next"}
      className="hidden shrink-0 rounded-full p-3 text-canvas hover:bg-canvas/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-canvas sm:block"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ transform: dir === "next" ? "scaleX(-1)" : undefined }}>
        <path d="M15 5l-7 7 7 7" />
      </svg>
    </button>
  );
}
