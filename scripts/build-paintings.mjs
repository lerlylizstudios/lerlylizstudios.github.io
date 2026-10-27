// Painting image pipeline (locked two-size webp decision). Reads source images
// from paintings-src/ and writes two webp derivatives per piece into
// public/paintings/: <id>-full.webp and <id>-thumb.webp. Sizes follow the
// "2× the largest rendered size" rule:
//   thumb — widest tile is the Home "Recent work" column, ~357px → 715px wide
//   full  — the lightbox is capped at 800px tall → at most 1600px tall
// Never upscales. Subfolders (e.g. paintings-src/originals/) are ignored.
// The gallery references only the webp paths. Re-run after adding sources:
//   node scripts/build-paintings.mjs
import { readdir, mkdir } from "node:fs/promises";
import { extname, basename, join } from "node:path";
import sharp from "sharp";

const SRC = "paintings-src";
const OUT = "public/paintings";
const FULL_H = 1600;
const THUMB_W = 715;

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));

for (const file of files) {
  const id = basename(file, extname(file));
  const src = join(SRC, file);
  await sharp(src)
    .resize({ height: FULL_H, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(join(OUT, `${id}-full.webp`));
  await sharp(src)
    .resize({ width: THUMB_W, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(join(OUT, `${id}-thumb.webp`));
  console.log(`✓ ${id} — full + thumb`);
}
console.log(`Done: ${files.length} paintings.`);
