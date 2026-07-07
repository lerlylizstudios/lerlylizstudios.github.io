// Palette token metadata — single source for rendering swatches and for any
// code that needs to reach for a pigment by name.
export type Pigment = {
  name: string;
  role: string;
  value: string;
  deep?: string;
  onDark?: boolean;
};

export const CANVAS: Pigment[] = [
  { name: "canvas", role: "Paper / page base", value: "#FBF6EC" },
  { name: "canvas.deep", role: "Recessed panels", value: "#F3EADB" },
  { name: "canvas.edge", role: "Hairline dividers", value: "#EADFCB" },
];

export const INK: Pigment[] = [
  { name: "ink", role: "Body + headings", value: "#241E1B", onDark: true },
  { name: "ink.soft", role: "Secondary text", value: "#5A504A", onDark: true },
  { name: "ink.faint", role: "Captions / meta", value: "#9A8F86" },
];

export const PIGMENTS: Pigment[] = [
  { name: "coral", role: "Primary action", value: "#FF5A3C", deep: "#EF3F1D", onDark: true },
  { name: "marigold", role: "Warm accent / booked", value: "#FFB020", deep: "#E6960A" },
  { name: "teal", role: "Success / open", value: "#10A594", deep: "#0B7F72", onDark: true },
  { name: "cobalt", role: "Cool accent", value: "#3355FF", deep: "#1F3BE0", onDark: true },
  { name: "fuchsia", role: "Pop accent", value: "#E63C8B", deep: "#CB2472", onDark: true },
  { name: "violet", role: "Pop accent", value: "#7A45E0", deep: "#5F2CC2", onDark: true },
];
