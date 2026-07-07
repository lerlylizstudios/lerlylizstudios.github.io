// Gallery tile — portfolio only (no price/sold in v1). Frameless-on-paper: the
// portraits are painted on cream that matches the site canvas, so we mount them
// nearly frameless — a soft warm drop-shadow + a painted double-edge — so they
// float like work on a gallery wall rather than sitting in boxed cards. Tapping
// a tile opens the lightbox (onOpen).
import { ScribbleField, BrokenStroke, Eye, Fleck } from "../art/svg";

export type Piece = {
  id: string;
  title: string;
  category: string;
  /** width/height of the real painting; drives the tile's true aspect. */
  ratio: number;
  tint: string;
  /** Screen-reader description of the painting (required in admin). Falls back
   *  to a "<title> — <category> portrait" string when absent on legacy data. */
  alt?: string;
  /** thumb path per the locked image decision; absent -> painterly placeholder. */
  thumb?: string;
  /** full-size path for the lightbox; absent -> placeholder. */
  full?: string;
};

const EDGE =
  "0 2px 3px rgba(120,90,60,.10), 0 16px 30px -18px rgba(120,80,50,.45), " +
  "inset 0 0 0 1px rgba(36,30,27,.16), inset 0 0 0 2px rgba(255,255,255,.16)";

/** The painting surface: real image (thumb or full) or the painterly stand-in. */
export function PieceVisual({ piece, size = "thumb" }: { piece: Piece; size?: "thumb" | "full" }) {
  const src = size === "full" ? piece.full ?? piece.thumb : piece.thumb;
  if (src) {
    return (
      <img
        src={src}
        alt={piece.alt || `${piece.title} — ${piece.category} portrait`}
        loading={size === "thumb" ? "lazy" : "eager"}
        decoding="async"
        className="h-full w-full object-cover"
      />
    );
  }
  return <Placeholder tint={piece.tint} />;
}

/** The painted-edge frame around a piece. Clickable when onOpen is given. */
export function PieceFrame({
  piece,
  size = "thumb",
  onOpen,
  className = "",
}: {
  piece: Piece;
  size?: "thumb" | "full";
  onOpen?: (id: string) => void;
  className?: string;
}) {
  const shared = "relative block w-full overflow-hidden rounded-[3px] bg-canvas";
  const style = { aspectRatio: String(piece.ratio), boxShadow: EDGE };
  if (!onOpen) {
    return (
      <div className={`${shared} ${className}`} style={style}>
        <PieceVisual piece={piece} size={size} />
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={() => onOpen(piece.id)}
      aria-label={`Open ${piece.title}, ${piece.category} portrait`}
      className={`${shared} transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${className}`}
      style={style}
    >
      <PieceVisual piece={piece} size={size} />
    </button>
  );
}

export function GalleryCard({ piece, onOpen }: { piece: Piece; onOpen?: (id: string) => void }) {
  return (
    <figure className="group mb-5 break-inside-avoid">
      <PieceFrame piece={piece} onOpen={onOpen} />
      <figcaption className="mt-2 flex items-baseline justify-between gap-2 px-0.5">
        <span className="font-display text-h3 leading-tight">{piece.title}</span>
        <span className="text-xs text-ink-faint">{piece.category}</span>
      </figcaption>
    </figure>
  );
}

/** Stand-in until real thumbs land: a scribbled field + broken outline + eyes. */
function Placeholder({ tint }: { tint: string }) {
  return (
    <div className="absolute inset-0">
      <ScribbleField color={tint} cross className="absolute inset-0 h-full w-full opacity-70" />
      <div className="absolute inset-[12%]" style={{ color: "var(--ink)" }}>
        <BrokenStroke className="h-full w-full opacity-80" color="currentColor" />
      </div>
      <div className="absolute left-[28%] top-[42%] w-[16%]">
        <Eye iris={tint} className="w-full" />
      </div>
      <div className="absolute left-[54%] top-[42%] w-[16%]">
        <Eye iris={tint} className="w-full" />
      </div>
      <div className="absolute right-[16%] top-[16%] w-[10%] text-white">
        <Fleck className="w-full" color="currentColor" />
      </div>
    </div>
  );
}
