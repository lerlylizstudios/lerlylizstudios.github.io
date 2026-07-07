// FAQ — real $35-buyer questions, owner-editable. Accessible accordion.
import { useState } from "react";
import { useData, type FaqDoc } from "../lib/useData";
import type { Page } from "../nav";

const EMPTY: FaqDoc = { faqs: [] };

export function FAQ({ nav }: { nav: (p: Page) => void }) {
  const doc = useData<FaqDoc>("/content/faq.json", EMPTY);
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-6 sm:py-14">
      <header className="mb-8">
        <p className="eyebrow">Good to know</p>
        <h1 className="mt-2 text-h1">Questions</h1>
      </header>

      <div className="divide-y divide-canvas-edge border-y border-canvas-edge">
        {doc.faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={i}>
              <h2>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                >
                  <span className="font-display text-h3">{f.q}</span>
                  <span aria-hidden className={`shrink-0 text-coral-deep transition-transform ${isOpen ? "rotate-45" : ""}`}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                  </span>
                </button>
              </h2>
              {isOpen && <p className="max-w-prose pb-5 text-ink-soft text-pretty">{f.a}</p>}
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <p className="text-ink-soft">Ready when you are.</p>
        <button className="btn-primary" onClick={() => nav("order")}>Order a portrait — $35</button>
      </div>
    </div>
  );
}
