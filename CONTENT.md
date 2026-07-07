# Editing the site content

Everything you can change without touching code lives in **`public/content/`** as four
plain-text `.json` files. Each file has a `_readme` line at the top reminding you what it
controls. This page is the fuller guide.

> **The one rule for JSON:** keep every `"quote"`, `,` comma, and `{ }` bracket exactly as
> you found them. Only change the words *inside* the quotes. If something breaks, undo your
> last edit. When in doubt, paste the file into a free "JSON validator" website to check it.

---

## The four content files (in `public/content/`)

### `gallery.json` — the portraits
Controls the **Gallery** page and the **Recent work** row on the Home page.

- `featuredId` — the `id` of the portrait shown large on the Home page. Must match one of
  the `id`s in the list.
- `pieces` — one entry per portrait. Each has:
  - `id` — a short unique name, no spaces (e.g. `"bella"`).
  - `title` — the pet's name, shown under the picture.
  - `category` — one of `Dogs`, `Cats`, `Ornaments`, `Studies`.
  - `ratio` — the image's width ÷ height (e.g. a 1200×1500 image is `0.8`).
  - `thumb` / `full` — the picture paths (see **Adding a new portrait** below).

### `settings.json` — the Order page
- `commissionsOpen` — `true` shows the **Order on Etsy** buttons everywhere; `false`
  switches them to **Join the waitlist** and flips the badge to "Booked".
- `listingDescription` — the paragraph under "About this piece". Rewrite freely.
- `howItWorks` — the three steps. Keep it to three; edit the words.

### `about.json` — the About page
- `statement` — your artist bio paragraph.
- `photo` — leave `""` for the placeholder, or paste an image path to show a real photo.
- `materials` — the small line under the photo.

### `faq.json` — the FAQ page
- `faqs` — the list of questions. Each is a `{ "q": "question", "a": "answer" }` pair.
  Add, remove, or reorder them; keep the `q`/`a` shape.

---

## Adding a new portrait

1. **Drop the original image** (a normal `.png` or `.jpg`, any size) into the
   **`paintings-src/`** folder. Name it simply, e.g. `bella.png`.
2. **Make the web-ready versions.** In a terminal, from the project folder, run:
   ```
   npm run paintings
   ```
   This creates `bella-thumb.webp` and `bella-full.webp` inside `public/paintings/`.
   (It re-processes every source image; that's fine.)
3. **Add an entry** to `pieces` in `public/content/gallery.json`, copying an existing line:
   ```json
   { "id": "bella", "title": "Bella", "category": "Dogs", "ratio": 0.8,
     "thumb": "/paintings/bella-thumb.webp", "full": "/paintings/bella-full.webp" }
   ```
   Set `ratio` to the image's width ÷ height. Put a comma after the previous entry.
4. Save. The new portrait appears in the Gallery.

To **remove** a portrait, delete its `{ ... }` entry from `gallery.json` (and make sure
`featuredId` still points at one that exists).

---

## Folders at a glance

- **`public/content/`** — the text you edit (the four files above).
- **`public/paintings/`** — the web-ready images. Made for you by `npm run paintings`;
  don't edit these by hand.
- **`paintings-src/`** — your original full-size images. Safe to keep; not shown on the site.
