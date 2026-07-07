// Edge-bleed placement system: positions art so it runs off the container
// edge, creating the "chaos spilling past the frame" tension. The parent must
// be `relative` and (usually) `overflow-hidden`.
import type { ReactNode } from "react";

type Edge = "tl" | "tr" | "bl" | "br" | "l" | "r" | "t" | "b";

const anchor: Record<Edge, string> = {
  tl: "top-0 left-0 -translate-x-1/3 -translate-y-1/3",
  tr: "top-0 right-0 translate-x-1/3 -translate-y-1/3",
  bl: "bottom-0 left-0 -translate-x-1/3 translate-y-1/3",
  br: "bottom-0 right-0 translate-x-1/3 translate-y-1/3",
  l: "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2",
  r: "top-1/2 right-0 translate-x-1/2 -translate-y-1/2",
  t: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
  b: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
};

export function EdgeBleed({
  edge = "tr",
  size = 240,
  rotate = 0,
  opacity = 1,
  className = "",
  children,
}: {
  edge?: Edge;
  /** px width of the art box. */
  size?: number;
  rotate?: number;
  opacity?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute z-0 ${anchor[edge]} ${className}`}
      style={{ width: size, height: size, opacity }}
    >
      <div style={{ transform: `rotate(${rotate}deg)`, width: "100%", height: "100%" }}>
        {children}
      </div>
    </div>
  );
}
