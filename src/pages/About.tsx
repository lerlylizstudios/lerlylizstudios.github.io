// About — artist statement (verbatim), photo slot, materials.
import { useData, type About as AboutData } from "../lib/useData";
import { ScribbleField, BrokenStroke, Eye } from "../art/svg";

const FALLBACK: AboutData = { statement: "", photo: "", materials: "" };

export function About() {
  const about = useData<AboutData>("/content/about.json", FALLBACK);

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-14">
      <header className="mb-8">
        <p className="eyebrow">The artist</p>
        <h1 className="mt-2 text-h1">About</h1>
      </header>

      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:gap-12">
        {/* Photo slot */}
        <div className="relative mx-auto w-full max-w-xs">
          <div
            className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-canvas"
            style={{ boxShadow: "0 16px 30px -18px rgba(120,80,50,.45), inset 0 0 0 1px rgba(36,30,27,.16)" }}
          >
            {about.photo ? (
              <img src={about.photo} alt="Lerly, the artist, in her studio" className="h-full w-full object-cover" />
            ) : (
              // Placeholder until the artist photo is added (owner-editable).
              <div className="absolute inset-0">
                <ScribbleField color="var(--marigold)" className="absolute inset-0 h-full w-full opacity-60" />
                <div className="absolute inset-[16%] text-ink"><BrokenStroke className="h-full w-full opacity-70" color="currentColor" /></div>
                <div className="absolute left-[30%] top-[40%] w-[16%]"><Eye iris="var(--teal)" className="w-full" /></div>
                <div className="absolute left-[54%] top-[40%] w-[16%]"><Eye iris="var(--teal)" className="w-full" /></div>
                <span className="absolute inset-x-0 bottom-3 text-center text-xs text-ink-faint">Artist photo coming soon</span>
              </div>
            )}
          </div>
        </div>

        {/* Statement + materials */}
        <div>
          <p className="text-lede text-ink text-pretty">{about.statement}</p>
          <dl className="mt-8 border-t border-canvas-edge pt-6">
            <dt className="eyebrow">Materials</dt>
            <dd className="mt-1 font-display text-h3">{about.materials}</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
