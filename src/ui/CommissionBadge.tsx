// Small status pill for commission availability. Also exposed as a helper the
// Order module reads to swap its CTA (open -> Order on Etsy, closed -> waitlist).
export function CommissionBadge({ open }: { open: boolean }) {
  return (
    <span
      className={
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-eyebrow font-semibold uppercase " +
        (open ? "bg-teal/12 text-teal-deep" : "bg-marigold/15 text-marigold-deep")
      }
    >
      <span
        aria-hidden
        className={"h-2 w-2 rounded-full " + (open ? "bg-teal" : "bg-marigold")}
      />
      {open ? "Commissions open" : "Booked — waitlist"}
    </span>
  );
}
