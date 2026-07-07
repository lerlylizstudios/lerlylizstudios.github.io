// Footer: page links, IG, copyright. Warm-but-plain.
import { NAV, type Page } from "../nav";
import { SITE } from "../lib/site";

export function Footer({ nav }: { nav: (p: Page) => void }) {
  return (
    <footer className="mt-20 border-t border-canvas-edge">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:px-6">
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {NAV.map(({ label, page }) => (
            <button
              key={page}
              onClick={() => nav(page)}
              className="text-sm font-semibold text-ink-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-ink-faint">
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            @lerly_lizstudio
          </a>
          <span>© {new Date().getFullYear()} {SITE.brand}</span>
        </div>
      </div>
    </footer>
  );
}
