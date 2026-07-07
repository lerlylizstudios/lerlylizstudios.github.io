// Order — the single $35 view: the Order module, a short "how it works", and
// the owner-editable Etsy listing description. The commissions open/closed state
// comes from settings.json and drives the badge sitewide; the owner flips it in
// the admin (#admin), which updates the site on save.
import type { Settings } from "../lib/useData";
import { SITE } from "../lib/site";
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
          <a className="btn-primary mt-5" href={SITE.etsyListing} target="_blank" rel="noreferrer">
            {commissionsOpen ? `Order on Etsy — ${SITE.price}` : "Join the waitlist"}
          </a>
        </div>
      </section>
    </div>
  );
}
