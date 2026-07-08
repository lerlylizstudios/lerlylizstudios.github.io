import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Set base to "/" for username.github.io, or "/repo-name/" for project pages
export default defineConfig({
  plugins: [react()],
  base: "/",
  define: {
    // A unique id minted on every build. Baked into the bundle and appended to
    // runtime content fetches (?v=…) so each deploy busts browser + CDN caches
    // for the un-fingerprinted public/content/*.json files. See src/lib/useData.ts.
    __BUILD_ID__: JSON.stringify(Date.now().toString(36)),
  },
});
