// ── Lerly Liz Studios — owner CMS ────────────────────────────────────────────
// Reached at #admin. The GitHub mechanics (ghGet / ghPut / diff-only save /
// re-GET-fresh-sha-before-each-PUT) are cloned verbatim from the proven
// artsyenigma admin. What's new here, per plan: in-browser image compression to
// two webp files committed as separate path-referenced files (NOT base64 in
// JSON), required alt text, real GitHub errors surfaced, confirm-before-delete,
// and a warm, plain-language skin. Nothing here ever says commit/repo/sha to the
// owner — it says "save", and "your site updates in about 2 minutes".
import { useCallback, useState, type ReactNode } from "react";

// ── CONFIG ───────────────────────────────────────────────
const REPO = "lerlylizstudios/lerlylizstudios.github.io";
const BRANCH = "main";
const FILES = {
  gallery: "public/content/gallery.json",
  settings: "public/content/settings.json",
  about: "public/content/about.json",
  faq: "public/content/faq.json",
};

const CATEGORIES = ["Dogs", "Cats", "Artwork", "Studies"] as const;
const TINTS = [
  "var(--violet)",
  "var(--marigold)",
  "var(--cobalt)",
  "var(--coral)",
  "var(--teal)",
  "var(--fuchsia)",
];

// ── TYPES ────────────────────────────────────────────────
interface Piece {
  id: string;
  title: string;
  category: string;
  ratio: number;
  tint: string;
  alt?: string;
  thumb?: string;
  full?: string;
}
interface GalleryData {
  _readme?: string;
  featuredId?: string;
  pieces: Piece[];
}
interface HowStep {
  step: string;
  detail: string;
}
interface SettingsData {
  _readme?: string;
  commissionsOpen: boolean;
  listingDescription: string;
  howItWorks: HowStep[];
}
interface AboutData {
  _readme?: string;
  statement: string;
  photo: string;
  materials: string;
}
interface FaqItem {
  q: string;
  a: string;
}
interface FaqData {
  _readme?: string;
  faqs: FaqItem[];
}

// A resized image waiting to be saved. sitePath is what the JSON references
// (e.g. /paintings/x-thumb.webp); repoPath is where the file actually lives.
interface PendingFile {
  sitePath: string;
  repoPath: string;
  base64: string;
  label: string;
}

type Tab = "Paintings" | "Commissions" | "About" | "FAQ";
const TABS: Tab[] = ["Paintings", "Commissions", "About", "FAQ"];

// ── GITHUB HELPERS (cloned verbatim) ─────────────────────
async function ghGet(token: string, path: string) {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    },
  );

  if (res.status === 404) return { json: null, sha: null, raw: "" };

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      `Couldn't read ${path} (${res.status})${(err as { message?: string }).message ? ` — ${(err as { message?: string }).message}` : ""}`,
    );
  }

  const data = await res.json();
  if (!data) throw new Error("No response from GitHub");

  let text = "";
  if (data.download_url) {
    const fileRes = await fetch(data.download_url);
    text = await fileRes.text();
  } else if (data.content && data.encoding === "base64") {
    const binary = atob(data.content.replace(/\n/g, ""));
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    text = new TextDecoder().decode(bytes);
  } else {
    throw new Error("GitHub returned no usable file content");
  }

  return { json: JSON.parse(text), sha: data.sha as string, raw: text };
}

async function ghPut(
  token: string,
  path: string,
  sha: string | null,
  content: unknown,
  msg: string,
) {
  const text = JSON.stringify(content, null, 2);
  const bytes = new TextEncoder().encode(text);
  const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join("");
  const encoded = btoa(binary);
  await ghPutRaw(token, path, sha, encoded, msg);
}

// Additive sibling of ghPut for already-base64 binary payloads (the webp files).
// Same PUT shape; it just skips the JSON serialize step.
async function ghPutRaw(
  token: string,
  path: string,
  sha: string | null,
  encoded: string,
  msg: string,
) {
  const body: Record<string, unknown> = {
    message: msg,
    content: encoded,
    branch: BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${path}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      `GitHub couldn't save ${path}: ${res.status} — ${(err as { message?: string }).message ?? "unknown error"}`,
    );
  }
}

// ── IMAGE HELPERS ─────────────────────────────────────────
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That file didn't look like an image we can read."));
    };
    img.src = url;
  });
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

// Draw the image into a canvas at most maxDim on its longest side, encode webp,
// and return the raw base64 (no data: prefix) ready for the Contents API.
function resizeToWebp(img: HTMLImageElement, maxDim: number): Promise<string> {
  const longest = Math.max(img.naturalWidth, img.naturalHeight);
  const scale = Math.min(1, maxDim / longest);
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.reject(new Error("Your browser couldn't process the image."));
  ctx.drawImage(img, 0, 0, w, h);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      async (blob) => {
        if (!blob) return reject(new Error("Your browser couldn't process the image."));
        const buf = await blob.arrayBuffer();
        resolve(bytesToBase64(new Uint8Array(buf)));
      },
      "image/webp",
      0.85,
    );
  });
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function uid() {
  return Math.random().toString(36).slice(2, 8);
}
function makeId(title: string, taken: Set<string>): string {
  const base = slugify(title) || `piece-${uid()}`;
  let id = base;
  while (taken.has(id)) id = `${base}-${uid()}`;
  return id;
}
const repoPathOf = (sitePath: string) => `public${sitePath}`;

// ── FALLBACKS ────────────────────────────────────────────
const EMPTY_GALLERY: GalleryData = { pieces: [] };
const EMPTY_SETTINGS: SettingsData = {
  commissionsOpen: true,
  listingDescription: "",
  howItWorks: [],
};
const EMPTY_ABOUT: AboutData = { statement: "", photo: "", materials: "" };
const EMPTY_FAQ: FaqData = { faqs: [] };

// ── COMPONENT ────────────────────────────────────────────
export default function Admin() {
  const [token, setToken] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<Tab>("Paintings");
  const [status, setStatus] = useState<{ type: "idle" | "ok" | "err"; msg: string }>({
    type: "idle",
    msg: "Log in to begin.",
  });

  const [gallery, setGallery] = useState<GalleryData>(EMPTY_GALLERY);
  const [galRaw, setGalRaw] = useState("");
  const [settings, setSettings] = useState<SettingsData>(EMPTY_SETTINGS);
  const [setRaw, setSetRaw] = useState("");
  const [about, setAbout] = useState<AboutData>(EMPTY_ABOUT);
  const [aboutRaw, setAboutRaw] = useState("");
  const [faq, setFaq] = useState<FaqData>(EMPTY_FAQ);
  const [faqRaw, setFaqRaw] = useState("");

  const [pending, setPending] = useState<PendingFile[]>([]);
  const [addedTitles, setAddedTitles] = useState<string[]>([]);

  // New-painting form
  const [nTitle, setNTitle] = useState("");
  const [nCategory, setNCategory] = useState<string>(CATEGORIES[0]);
  const [nAlt, setNAlt] = useState("");
  const [nFile, setNFile] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState(0);

  // ── LOAD ───────────────────────────────────────────────
  const load = useCallback(async () => {
    if (!token.trim()) {
      setStatus({ type: "err", msg: "Please paste your access key first." });
      return;
    }
    setBusy(true);
    setStatus({ type: "idle", msg: "Loading your content…" });
    try {
      const [g, s, a, f] = await Promise.all([
        ghGet(token, FILES.gallery),
        ghGet(token, FILES.settings),
        ghGet(token, FILES.about),
        ghGet(token, FILES.faq),
      ]);
      setGallery(g.json ?? EMPTY_GALLERY);
      setGalRaw(g.raw);
      setSettings(s.json ?? EMPTY_SETTINGS);
      setSetRaw(s.raw);
      setAbout(a.json ?? EMPTY_ABOUT);
      setAboutRaw(a.raw);
      setFaq(f.json ?? EMPTY_FAQ);
      setFaqRaw(f.raw);
      setPending([]);
      setAddedTitles([]);
      setHasLoaded(true);
      setStatus({ type: "ok", msg: "Ready. Make your changes, then Save." });
    } catch (e) {
      setStatus({ type: "err", msg: (e as Error).message });
      console.error(e);
    } finally {
      setBusy(false);
    }
  }, [token]);

  // ── SAVE ───────────────────────────────────────────────
  const save = useCallback(async () => {
    setBusy(true);
    setStatus({ type: "idle", msg: "Saving…" });
    try {
      // 1) New/updated images first — one file at a time, fresh sha before each.
      for (const pf of pending) {
        const fresh = await ghGet(token, pf.repoPath);
        await ghPutRaw(token, pf.repoPath, fresh.sha, pf.base64, pf.label);
      }
      const savedImages = pending.length > 0;
      setPending([]);

      // 2) The four content files, diff-only, one at a time (re-GET fresh sha).
      const galMsg = addedTitles.length
        ? `Add painting: ${addedTitles.join(", ")}`
        : "Update paintings";
      const galChanged = await saveJson(token, FILES.gallery, gallery, galRaw, setGalRaw, galMsg);
      const setChanged = await saveJson(token, FILES.settings, settings, setRaw, setSetRaw, "Update commissions & order info");
      const aboutChanged = await saveJson(token, FILES.about, about, aboutRaw, setAboutRaw, "Update About page");
      const faqChanged = await saveJson(token, FILES.faq, faq, faqRaw, setFaqRaw, "Update FAQ");

      setAddedTitles([]);

      if (!savedImages && !galChanged && !setChanged && !aboutChanged && !faqChanged) {
        setStatus({ type: "ok", msg: "Nothing had changed — you're all set." });
      } else {
        setStatus({
          type: "ok",
          msg: "Saved! Your site updates in about 2 minutes.",
        });
      }
    } catch (e) {
      setStatus({ type: "err", msg: (e as Error).message });
      console.error(e);
    } finally {
      setBusy(false);
    }
  }, [token, pending, addedTitles, gallery, galRaw, settings, setRaw, about, aboutRaw, faq, faqRaw]);

  // ── PAINTINGS helpers ──────────────────────────────────
  const addPainting = async () => {
    if (!nFile) return setStatus({ type: "err", msg: "Please choose a photo of the painting." });
    if (!nTitle.trim()) return setStatus({ type: "err", msg: "Please give the painting a name." });
    if (!nAlt.trim()) return setStatus({ type: "err", msg: "Please describe the painting for screen readers." });
    setBusy(true);
    setStatus({ type: "idle", msg: "Preparing the image…" });
    try {
      const img = await loadImage(nFile);
      const ratio = Number((img.naturalWidth / img.naturalHeight).toFixed(4));
      const taken = new Set(gallery.pieces.map((p) => p.id));
      const id = makeId(nTitle, taken);
      const [fullB64, thumbB64] = await Promise.all([
        resizeToWebp(img, 1600),
        resizeToWebp(img, 480),
      ]);
      const thumb = `/paintings/${id}-thumb.webp`;
      const full = `/paintings/${id}-full.webp`;
      const tint = TINTS[gallery.pieces.length % TINTS.length];
      const piece: Piece = {
        id,
        title: nTitle.trim(),
        category: nCategory,
        ratio,
        tint,
        alt: nAlt.trim(),
        thumb,
        full,
      };
      setGallery((g) => ({ ...g, pieces: [...g.pieces, piece] }));
      setPending((p) => [
        ...p,
        { sitePath: full, repoPath: repoPathOf(full), base64: fullB64, label: `Add painting image: ${id}` },
        { sitePath: thumb, repoPath: repoPathOf(thumb), base64: thumbB64, label: `Add painting thumbnail: ${id}` },
      ]);
      setAddedTitles((t) => [...t, piece.title]);
      setNTitle("");
      setNAlt("");
      setNCategory(CATEGORIES[0]);
      setNFile(null);
      setFileKey((k) => k + 1);
      setStatus({ type: "ok", msg: `Added "${piece.title}". Remember to Save.` });
    } catch (e) {
      setStatus({ type: "err", msg: (e as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const updatePiece = (id: string, key: keyof Piece, val: string) =>
    setGallery((g) => ({
      ...g,
      pieces: g.pieces.map((p) => (p.id === id ? { ...p, [key]: val } : p)),
    }));

  const removePiece = (id: string) => {
    const p = gallery.pieces.find((x) => x.id === id);
    if (!p) return;
    if (!confirm(`Remove "${p.title}"? This can't be undone.`)) return;
    setGallery((g) => ({
      ...g,
      featuredId: g.featuredId === id ? undefined : g.featuredId,
      pieces: g.pieces.filter((x) => x.id !== id),
    }));
    setPending((pf) => pf.filter((f) => f.sitePath !== p.thumb && f.sitePath !== p.full));
    setAddedTitles((t) => t.filter((title) => title !== p.title));
  };

  const movePiece = (i: number, dir: -1 | 1) =>
    setGallery((g) => {
      const arr = [...g.pieces];
      const j = i + dir;
      if (j < 0 || j >= arr.length) return g;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...g, pieces: arr };
    });

  const setFeatured = (id: string) => setGallery((g) => ({ ...g, featuredId: id }));

  const previewFor = (p: Piece) =>
    pending.find((f) => f.sitePath === p.thumb)?.base64
      ? `data:image/webp;base64,${pending.find((f) => f.sitePath === p.thumb)!.base64}`
      : p.thumb;

  // ── ABOUT photo ────────────────────────────────────────
  const uploadAboutPhoto = async (file: File | null) => {
    if (!file) return;
    setBusy(true);
    setStatus({ type: "idle", msg: "Preparing the photo…" });
    try {
      const img = await loadImage(file);
      const b64 = await resizeToWebp(img, 1000);
      const sitePath = "/paintings/about-photo.webp";
      setPending((p) => [
        ...p.filter((f) => f.sitePath !== sitePath),
        { sitePath, repoPath: repoPathOf(sitePath), base64: b64, label: "Update About photo" },
      ]);
      setAbout((a) => ({ ...a, photo: sitePath }));
      setStatus({ type: "ok", msg: "Photo ready. Remember to Save." });
    } catch (e) {
      setStatus({ type: "err", msg: (e as Error).message });
    } finally {
      setBusy(false);
    }
  };
  const aboutPreview =
    pending.find((f) => f.sitePath === about.photo)?.base64
      ? `data:image/webp;base64,${pending.find((f) => f.sitePath === about.photo)!.base64}`
      : about.photo;

  // ── FAQ helpers ────────────────────────────────────────
  const addFaq = () => setFaq((f) => ({ ...f, faqs: [...f.faqs, { q: "", a: "" }] }));
  const updFaq = (i: number, key: "q" | "a", val: string) =>
    setFaq((f) => ({
      ...f,
      faqs: f.faqs.map((x, idx) => (idx === i ? { ...x, [key]: val } : x)),
    }));
  const remFaq = (i: number) => {
    if (!confirm("Remove this question? This can't be undone.")) return;
    setFaq((f) => ({ ...f, faqs: f.faqs.filter((_, idx) => idx !== i) }));
  };
  const moveFaq = (i: number, dir: -1 | 1) =>
    setFaq((f) => {
      const arr = [...f.faqs];
      const j = i + dir;
      if (j < 0 || j >= arr.length) return f;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...f, faqs: arr };
    });

  // ── LOGIN GATE ─────────────────────────────────────────
  if (!hasLoaded) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
        <p className="eyebrow">Lerly Liz Studios</p>
        <h1 className="mt-2 text-h1">Studio sign-in</h1>
        <p className="mt-3 text-ink-soft text-pretty">
          Paste your personal access key to edit your site. It stays on this
          device and is never saved anywhere.
        </p>
        <label className="mt-8 block text-base font-semibold">Access key</label>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          placeholder="github_pat_…"
          className="mt-2 w-full rounded-frame bg-canvas-deep px-4 py-3 text-base ring-1 ring-ink/15 focus:outline-none focus:ring-2 focus:ring-ink"
        />
        <button onClick={load} disabled={busy} className="btn-primary mt-5">
          {busy ? "Loading…" : "Log in"}
        </button>
        <StatusLine status={status} />
        <p className="mt-8 text-sm text-ink-faint text-pretty">
          Don't have a key yet? See ADMIN_GUIDE.md for the one-time setup — it
          takes about five minutes.
        </p>
      </div>
    );
  }

  // ── MAIN ───────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-6">
      <header className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="eyebrow">Lerly Liz Studios</p>
          <h1 className="text-h1">Edit your site</h1>
        </div>
        <button
          onClick={() => {
            setToken("");
            setHasLoaded(false);
            setStatus({ type: "idle", msg: "Logged out." });
          }}
          className="btn-ghost !px-4 !py-2 text-sm"
        >
          Log out
        </button>
      </header>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors " +
              (tab === t ? "bg-ink text-canvas" : "bg-canvas-deep text-ink-soft ring-1 ring-ink/10 hover:text-ink")
            }
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── PAINTINGS ── */}
      {tab === "Paintings" && (
        <div className="flex flex-col gap-6">
          <section className="frame p-5">
            <h2 className="text-h3 font-display">Add a painting</h2>
            <div className="mt-4 flex flex-col gap-4">
              <div>
                <label className="block text-base font-semibold">Photo of the painting</label>
                <input
                  key={fileKey}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNFile(e.target.files?.[0] ?? null)}
                  className="mt-2 block w-full text-sm text-ink-soft"
                />
              </div>
              <Field label="Pet's name (shown under the painting)">
                <input
                  value={nTitle}
                  onChange={(e) => setNTitle(e.target.value)}
                  placeholder="e.g. Bella"
                  className={inputCls}
                />
              </Field>
              <Field label="Category">
                <select value={nCategory} onChange={(e) => setNCategory(e.target.value)} className={inputCls}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Describe the painting for screen readers (required)">
                <textarea
                  value={nAlt}
                  onChange={(e) => setNAlt(e.target.value)}
                  rows={2}
                  placeholder="e.g. Golden retriever with a blue background, painted in warm oranges."
                  className={inputCls}
                />
              </Field>
              <button onClick={addPainting} disabled={busy} className="btn-primary w-fit">
                {busy ? "Working…" : "Add painting"}
              </button>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-h3 font-display">Your paintings ({gallery.pieces.length})</h2>
            {gallery.pieces.map((p, i) => {
              const featured = gallery.featuredId === p.id;
              const preview = previewFor(p);
              return (
                <div key={p.id} className="frame p-4">
                  <div className="flex gap-4">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-[3px] bg-canvas-deep">
                      {preview && <img src={preview} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <div className="flex flex-1 flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm text-ink-faint">#{i + 1}</span>
                        <div className="flex gap-1">
                          <IconBtn onClick={() => movePiece(i, -1)} label="Move up">↑</IconBtn>
                          <IconBtn onClick={() => movePiece(i, 1)} label="Move down">↓</IconBtn>
                          <IconBtn onClick={() => removePiece(p.id)} label="Remove" danger>✕</IconBtn>
                        </div>
                      </div>
                      <input
                        value={p.title}
                        onChange={(e) => updatePiece(p.id, "title", e.target.value)}
                        placeholder="Pet's name"
                        className={inputCls}
                      />
                      <div className="flex gap-2">
                        <select
                          value={p.category}
                          onChange={(e) => updatePiece(p.id, "category", e.target.value)}
                          className={inputCls}
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => setFeatured(p.id)}
                          className={
                            "whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold ring-1 " +
                            (featured ? "bg-marigold text-ink ring-transparent" : "bg-canvas text-ink-soft ring-ink/15 hover:text-ink")
                          }
                        >
                          {featured ? "★ On Home" : "Show on Home"}
                        </button>
                      </div>
                      <textarea
                        value={p.alt ?? ""}
                        onChange={(e) => updatePiece(p.id, "alt", e.target.value)}
                        rows={2}
                        placeholder="Describe the painting for screen readers (required)"
                        className={inputCls + (p.alt?.trim() ? "" : " ring-coral")}
                      />
                      {!p.alt?.trim() && (
                        <p className="text-sm text-coral">Please add a description for screen readers.</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      )}

      {/* ── COMMISSIONS ── */}
      {tab === "Commissions" && (
        <div className="flex flex-col gap-6">
          <section className="frame p-5">
            <h2 className="text-h3 font-display">Are you taking orders?</h2>
            <p className="mt-1 text-sm text-ink-soft">
              This flips the badge and buttons across your whole site.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setSettings((s) => ({ ...s, commissionsOpen: true }))}
                className={
                  "rounded-full px-5 py-2.5 text-sm font-semibold ring-1 " +
                  (settings.commissionsOpen ? "bg-teal text-white ring-transparent" : "bg-canvas text-ink-soft ring-ink/15")
                }
              >
                Open — taking orders
              </button>
              <button
                onClick={() => setSettings((s) => ({ ...s, commissionsOpen: false }))}
                className={
                  "rounded-full px-5 py-2.5 text-sm font-semibold ring-1 " +
                  (!settings.commissionsOpen ? "bg-marigold text-ink ring-transparent" : "bg-canvas text-ink-soft ring-ink/15")
                }
              >
                Booked — waitlist only
              </button>
            </div>
          </section>

          <Field label="Listing description (the paragraph under “About this piece”)">
            <textarea
              value={settings.listingDescription}
              onChange={(e) => setSettings((s) => ({ ...s, listingDescription: e.target.value }))}
              rows={6}
              className={inputCls}
            />
          </Field>

          <section>
            <h2 className="text-h3 font-display">How it works (three steps)</h2>
            <div className="mt-3 flex flex-col gap-4">
              {settings.howItWorks.map((s, i) => (
                <div key={i} className="frame p-4">
                  <span className="text-sm text-ink-faint">Step {i + 1}</span>
                  <input
                    value={s.step}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        howItWorks: prev.howItWorks.map((x, idx) => (idx === i ? { ...x, step: e.target.value } : x)),
                      }))
                    }
                    placeholder="Step title"
                    className={inputCls + " mt-1"}
                  />
                  <textarea
                    value={s.detail}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        howItWorks: prev.howItWorks.map((x, idx) => (idx === i ? { ...x, detail: e.target.value } : x)),
                      }))
                    }
                    rows={2}
                    placeholder="Step detail"
                    className={inputCls + " mt-2"}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ── ABOUT ── */}
      {tab === "About" && (
        <div className="flex flex-col gap-6">
          <Field label="Your artist statement">
            <textarea
              value={about.statement}
              onChange={(e) => setAbout((a) => ({ ...a, statement: e.target.value }))}
              rows={6}
              className={inputCls}
            />
          </Field>
          <section className="frame p-5">
            <label className="block text-base font-semibold">Your photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => uploadAboutPhoto(e.target.files?.[0] ?? null)}
              className="mt-2 block w-full text-sm text-ink-soft"
            />
            {aboutPreview && (
              <div className="mt-3">
                <img src={aboutPreview} alt="" className="max-h-48 rounded-[3px]" />
                <button
                  onClick={() => {
                    setAbout((a) => ({ ...a, photo: "" }));
                    setPending((p) => p.filter((f) => f.sitePath !== "/paintings/about-photo.webp"));
                  }}
                  className="btn-ghost mt-2 !px-4 !py-2 text-sm"
                >
                  Remove photo
                </button>
              </div>
            )}
          </section>
          <Field label="Materials line (under your photo)">
            <input
              value={about.materials}
              onChange={(e) => setAbout((a) => ({ ...a, materials: e.target.value }))}
              className={inputCls}
            />
          </Field>
        </div>
      )}

      {/* ── FAQ ── */}
      {tab === "FAQ" && (
        <div className="flex flex-col gap-4">
          {faq.faqs.map((item, i) => (
            <div key={i} className="frame p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-ink-faint">#{i + 1}</span>
                <div className="flex gap-1">
                  <IconBtn onClick={() => moveFaq(i, -1)} label="Move up">↑</IconBtn>
                  <IconBtn onClick={() => moveFaq(i, 1)} label="Move down">↓</IconBtn>
                  <IconBtn onClick={() => remFaq(i)} label="Remove" danger>✕</IconBtn>
                </div>
              </div>
              <input
                value={item.q}
                onChange={(e) => updFaq(i, "q", e.target.value)}
                placeholder="Question"
                className={inputCls}
              />
              <textarea
                value={item.a}
                onChange={(e) => updFaq(i, "a", e.target.value)}
                rows={3}
                placeholder="Answer"
                className={inputCls + " mt-2"}
              />
            </div>
          ))}
          <button onClick={addFaq} className="btn-ghost w-fit">+ Add a question</button>
        </div>
      )}

      {/* Save bar */}
      <div className="sticky bottom-0 mt-8 -mx-5 border-t border-ink/10 bg-canvas/95 px-5 py-4 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <StatusLine status={status} inline />
          <button onClick={save} disabled={busy} className="btn-primary">
            {busy ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── SMALL UI BITS ────────────────────────────────────────
const inputCls =
  "w-full rounded-frame bg-canvas-deep px-3 py-2 text-base text-ink ring-1 ring-ink/15 focus:outline-none focus:ring-2 focus:ring-ink";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-base font-semibold">{label}</span>
      {children}
    </label>
  );
}

function IconBtn({
  onClick,
  label,
  danger,
  children,
}: {
  onClick: () => void;
  label: string;
  danger?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={
        "flex h-8 w-8 items-center justify-center rounded-full text-sm ring-1 " +
        (danger ? "text-coral ring-coral/30 hover:bg-coral/10" : "text-ink-soft ring-ink/15 hover:text-ink")
      }
    >
      {children}
    </button>
  );
}

function StatusLine({
  status,
  inline,
}: {
  status: { type: "idle" | "ok" | "err"; msg: string };
  inline?: boolean;
}) {
  const color =
    status.type === "ok" ? "text-teal" : status.type === "err" ? "text-coral" : "text-ink-soft";
  return <p className={`${inline ? "" : "mt-4 "}text-sm ${color}`}>{status.msg}</p>;
}

// ── diff-only JSON save (cloned model): serialize, skip if unchanged, else
// re-GET fresh sha immediately before the PUT. ──────────────────────────────
async function saveJson(
  token: string,
  path: string,
  data: unknown,
  raw: string,
  setRaw: (v: string) => void,
  msg: string,
): Promise<boolean> {
  const next = JSON.stringify(data, null, 2);
  if (next === raw.trim()) return false;
  const fresh = await ghGet(token, path);
  await ghPut(token, path, fresh.sha, data, msg);
  setRaw(next);
  return true;
}
