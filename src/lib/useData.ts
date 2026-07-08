// Tiny JSON loader for the owner-editable content in public/content/*.json (the
// same files the Phase 4 admin will write via the Contents API). Returns the
// parsed data or a fallback while loading / on error, so pages never crash on a
// missing file.
import { useEffect, useState } from "react";
import type { Piece } from "../ui/GalleryCard";

export type Gallery = { featuredId?: string; pieces: Piece[] };
export type HowStep = { step: string; detail: string };
export type Settings = {
  commissionsOpen: boolean;
  listingDescription: string;
  howItWorks: HowStep[];
};
export type About = { statement: string; photo: string; materials: string };
export type Faq = { q: string; a: string };
export type FaqDoc = { faqs: Faq[] };

export function useData<T>(path: string, fallback: T): T {
  const [data, setData] = useState<T>(fallback);
  useEffect(() => {
    let alive = true;
    // The public/content/*.json files sit at stable, un-fingerprinted URLs, so
    // the browser + GitHub Pages CDN happily serve stale copies after an edit.
    // A per-build version (`?v=<BUILD_ID>`, minted fresh each deploy) makes the
    // URL unique per release — a guaranteed cache miss on every deploy, but
    // still cacheable within one release. `no-cache` forces revalidation as a
    // second line of defense against the browser's HTTP cache.
    const url = `${path}?v=${__BUILD_ID__}`;
    fetch(url, { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => alive && setData(d as T))
      .catch(() => alive && setData(fallback));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);
  return data;
}
