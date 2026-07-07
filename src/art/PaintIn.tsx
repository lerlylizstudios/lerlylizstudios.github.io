// Scroll paint-in wrapper. No IntersectionObserver — the reveal is driven
// entirely by the CSS `.paint-in` scroll timeline (see index.css). Browsers
// without scroll-timeline support, and reduced-motion users, get the final
// painted state with no flash of hidden content.
import type { ElementType, ReactNode } from "react";

export function PaintIn({
  as: Tag = "div",
  slow = false,
  delay,
  className = "",
  children,
}: {
  as?: ElementType;
  slow?: boolean;
  /** Optional stagger, seconds. */
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={`paint-in${slow ? " paint-in-slow" : ""} ${className}`}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}
