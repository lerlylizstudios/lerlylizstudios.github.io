// Order — the Order module, the price list (mirrors the Etsy listings), a short
// "how it works", and the owner-editable Etsy listing description. The
// commissions open/closed state comes from settings.json and drives the badge
// sitewide; the owner flips it in the admin (#admin), which updates the site on
// save.
import type { Settings } from "../lib/useData";
import { SITE, PRODUCTS } from "../lib/site";
import { OrderModule } from "../ui/OrderModule";
import { CommaDab } from "../art/svg";

export function Order({
  settings,
  commissionsOpen,
}: {
  settings: Settings;
  commissionsOpen: boolean;
}) {
  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-14">
      <header className="mb-8">
        <p className="eyebrow">Commissions</p>
        <h1 className="mt-2 text-h1">Order a portrait</h1>
      </header>

      <OrderModule open={commissionsOpen} />

      {/* Prices — mirrors the Etsy listings; edit them in lib/site.ts. */}
      <section className="mt-12">
        <h2 className="text-h2">Prices</h2>
        <ul className="mt-6 grid gap-5 sm:grid-cols-2">
          {PRODUCTS.map((p) => (
            <li key={p.name} className="frame flex flex-col gap-4 p-5">
              {p.image && (
                // Same-size 3:2 box on every card so the row lines up; contain
                // shows the whole photo whatever its shape (no cropping).
                <div className="relative aspect-[3/2]">
                  {/* Source: original artwork by Lerly Liz Studios */}
                  <img
                    src={p.image.src}
                    alt={p.image.alt}
                    width={p.image.width}
                    height={p.image.height}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                </div>
              )}
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-h3 text-pretty">{p.name}</h3>
                <span className="whitespace-nowrap font-display text-h3 font-semibold">{p.price}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* How it works */}
      <section className="mt-12">
        <h2 className="text-h2">How it works</h2>
        <ol className="mt-6 grid gap-5 sm:grid-cols-3">
          {settings.howItWorks.map((s, i) => (
            <li key={i} className="frame p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-6 w-6"><CommaDab color="var(--coral)" /></span>
                <span className="eyebrow">Step {i + 1}</span>
              </div>
              <h3 className="font-display text-h3">{s.step}</h3>
              <p className="mt-1 text-sm text-ink-soft text-pretty">{s.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Listing description */}
      <section className="mt-12">
        <h2 className="text-h2">About this piece</h2>
        <div className="frame mt-4 p-6">
          <p className="text-ink-soft text-pretty">{settings.listingDescription}</p>
          <a className="btn-primary mt-5" href={SITE.etsyListing} target="_blank" rel="noopener noreferrer">
            {commissionsOpen ? `Order on Etsy — ${SITE.price}` : "Join the waitlist"}
          </a>
        </div>
      </section>
    </div>
  );
}
