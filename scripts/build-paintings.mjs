// Painting image pipeline (locked two-size webp decision). Reads source images
// from paintings-src/ and writes two webp derivatives per piece into
// public/paintings/: <id>-full.webp (~1600px) and <id>-thumb.webp (~480px).
// The gallery references only the webp paths. Re-run after adding sources:
//   node scripts/build-paintings.mjs
import { readdir, mkdir } from "node:fs/promises";
import { extname, basename, join } from "node:path";
import sharp from "sharp";

const SRC = "paintings-src";
const OUT = "public/paintings";
const FULL = 1600;
const THUMB = 480;

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));

for (const file of files) {
  const id = basename(file, extname(file));
  const src = join(SRC, file);
  await sharp(src)
    .resize({ width: FULL, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(join(OUT, `${id}-full.webp`));
  await sharp(src)
    .resize({ width: THUMB, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(join(OUT, `${id}-thumb.webp`));
  console.log(`✓ ${id} — full + thumb`);
}
console.log(`Done: ${files.length} paintings.`);
