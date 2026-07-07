/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Wet-canvas palette. `canvas` = warm paper, `ink` = warm near-black.
        canvas: { DEFAULT: "#FBF6EC", deep: "#F3EADB", edge: "#EADFCB" },
        ink: { DEFAULT: "#241E1B", soft: "#5A504A", faint: "#9A8F86" },
        // Bold / unexpected accents — the "splash" pigments.
        coral: { DEFAULT: "#FF5A3C", deep: "#EF3F1D" },
        marigold: { DEFAULT: "#FFB020", deep: "#E6960A" },
        teal: { DEFAULT: "#10A594", deep: "#0B7F72" },
        cobalt: { DEFAULT: "#3355FF", deep: "#1F3BE0" },
        fuchsia: { DEFAULT: "#E63C8B", deep: "#CB2472" },
        violet: { DEFAULT: "#7A45E0", deep: "#5F2CC2" },
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        body: ['"Hanken Grotesk"', "system-ui", "sans-serif"],
        script: ['"Caveat"', "cursive"],
      },
      fontSize: {
        // Fluid scale — clamp(min, vw, max).
        display: ["clamp(2.75rem, 6.5vw, 5rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        h1: ["clamp(2.1rem, 4.5vw, 3.25rem)", { lineHeight: "1.02", letterSpacing: "-0.015em" }],
        h2: ["clamp(1.6rem, 3vw, 2.25rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        h3: ["clamp(1.25rem, 2vw, 1.5rem)", { lineHeight: "1.2" }],
        lede: ["clamp(1.1rem, 1.6vw, 1.35rem)", { lineHeight: "1.55" }],
        eyebrow: ["0.78rem", { lineHeight: "1", letterSpacing: "0.18em" }],
      },
      borderRadius: { frame: "0.5rem" },
      boxShadow: {
        frame: "0 1px 2px rgba(36,30,27,.06), 0 18px 40px -24px rgba(36,30,27,.35)",
        lift: "0 2px 4px rgba(36,30,27,.08), 0 30px 60px -30px rgba(36,30,27,.45)",
      },
    },
  },
  plugins: [],
};
