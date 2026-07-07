// The one commerce module for v1: "Order your pet's portrait — $35 on Etsy".
// Reused verbatim on Home and in the single Order view. The `open` toggle swaps
// the CTA between ordering and the waitlist. A scribbled color field (chaos)
// bleeds off one edge; the calm card (clarity) sits over it, paper-dominant.
import { SITE } from "../lib/site";
import { CommissionBadge } from "./CommissionBadge";
import { EdgeBleed } from "../art/EdgeBleed";
import { ScribbleField, CommaDab, HatchSet } from "../art/svg";

export function OrderModule({ open = true }: { open?: boolean }) {
  return (
    <section className="relative overflow-hidden rounded-frame bg-canvas-deep p-1">
      {/* Scribbled field bleeding off the top-right; sparse accent flicks. */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-72 opacity-70">
        <ScribbleField color="var(--coral)" cross className="h-full w-full" />
      </div>
      <EdgeBleed edge="bl" size={150} rotate={-12} opacity={0.85}>
        <HatchSet color="var(--cobalt)" />
      </EdgeBleed>
      <EdgeBleed edge="br" size={90} rotate={30} opacity={0.9}>
        <CommaDab color="var(--marigold)" />
      </EdgeBleed>

      <div className="frame relative z-10 flex flex-col items-start gap-5 p-8 sm:p-10">
        <CommissionBadge open={open} />
        <div>
          <h2 className="text-h2">
            Order your pet&rsquo;s <span className="brush-underline">portrait</span>
          </h2>
          <p className="mt-3 max-w-prose text-lede text-ink-soft text-pretty">
            {SITE.product}, hand-painted just for you — {SITE.price}. Ships from{" "}
            {SITE.shipsFrom}.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {open ? (
            <a className="btn-primary" href={SITE.etsyListing} target="_blank" rel="noreferrer">
              Order on Etsy — {SITE.price}
            </a>
          ) : (
            <a className="btn-ink" href={SITE.instagram} target="_blank" rel="noreferrer">
              Booked — join the waitlist
            </a>
          )}
          <a className="btn-ghost" href={SITE.etsyShop} target="_blank" rel="noreferrer">
            Visit the Etsy shop
          </a>
        </div>
      </div>
    </section>
  );
}
