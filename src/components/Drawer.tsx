// Slide-in drawer nav (no router). Focus-trapped, Esc to close, backdrop click
// to close, scroll-locked while open. Holds the page links + IG.
import { useRef } from "react";
import { NAV, type Page } from "../nav";
import { SITE } from "../lib/site";
import { useModal } from "../lib/useModal";
import { CommaDab } from "../art/svg";

export function Drawer({
  open,
  current,
  onClose,
  nav,
}: {
  open: boolean;
  current: Page;
  onClose: () => void;
  nav: (p: Page) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  useModal(open, ref, onClose);

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden
        className={`fixed inset-0 z-40 bg-ink/45 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <nav
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-50 flex h-full w-[82vw] max-w-sm flex-col gap-1 bg-canvas px-6 py-6 shadow-lift transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="eyebrow">Menu</span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-full p-2 text-ink-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {NAV.map(({ label, page }) => {
          const on = page === current;
          return (
            <button
              key={page}
              onClick={() => nav(page)}
              aria-current={on ? "page" : undefined}
              className="group flex items-center gap-3 border-b border-canvas-edge py-4 text-left font-display text-2xl text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
            >
              <span className={`h-5 w-5 shrink-0 transition-opacity ${on ? "opacity-100" : "opacity-0 group-hover:opacity-60"}`}>
                <CommaDab color="var(--coral)" />
              </span>
              {on ? <span className="brush-underline">{label}</span> : label}
            </button>
          );
        })}

        <a
          href={SITE.instagram}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
          </svg>
          Follow on Instagram
        </a>
      </nav>
    </>
  );
}
