// Sticky top bar: brand wordmark (→ home) + a hamburger that opens the drawer.
// Mobile-first; the drawer holds the links at every size (mirrors the reference).
import type { Page } from "../nav";

export function SiteHeader({ nav, onMenuOpen }: { nav: (p: Page) => void; onMenuOpen: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-canvas-edge bg-canvas/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-6">
        <button
          onClick={() => nav("home")}
          className="font-display text-xl font-semibold tracking-tight text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        >
          Lerly Liz Studios
        </button>
        <button
          onClick={onMenuOpen}
          aria-label="Open menu"
          aria-haspopup="dialog"
          className="-mr-2 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-ink-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
          Menu
        </button>
      </div>
    </header>
  );
}
