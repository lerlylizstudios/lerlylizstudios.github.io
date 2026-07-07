// Shared nav model for the hand-rolled page switch (no router).
export type Page = "home" | "gallery" | "order" | "about" | "faq";

export const NAV: { label: string; page: Page }[] = [
  { label: "Home", page: "home" },
  { label: "Gallery", page: "gallery" },
  { label: "Order", page: "order" },
  { label: "About", page: "about" },
  { label: "FAQ", page: "faq" },
];
