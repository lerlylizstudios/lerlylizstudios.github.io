// Site-wide constants. Single source for brand, external links, and prices.
export const SITE = {
  brand: "Lerly Liz Studios",
  instagram: "https://www.instagram.com/lerly_lizstudios/",
  instagramHandle: "@lerly_lizstudios",
  etsyShop: "https://www.etsy.com/shop/LerlyLizstudios",
  // etsyListing is the 8×10 portrait listing, so `price` must match it.
  etsyListing:
    "https://www.etsy.com/listing/4529935930/custom-8x10-acrylic-pet-portrait-hand",
  price: "$45",
  // Cheapest ornament (paw print) — the "from $10" on ornament buttons.
  ornamentPrice: "$10",
  product: "Custom 8×10 acrylic pet portrait",
  shipsFrom: "Pompano Beach, FL",
  statement:
    "I create vibrant, expressive pet portraits using bold brushstrokes and unexpected color to capture not just how a pet looks, but who they are. Every portrait is hand-painted in acrylic with rich texture, movement, and personality.",
} as const;

// The Order page price list — mirrors the Etsy listings. width/height are the
// image file's real pixel size (reserves space so the page doesn't jump). The
// two portrait examples reuse gallery thumbs (715px wide = 2× their widest
// use, the Home "Recent work" tile; on these cards they're smaller).
export type Product = {
  name: string;
  price: string;
  image?: { src: string; alt: string; width: number; height: number };
};

export const PRODUCTS: Product[] = [
  {
    name: "Custom 8×10 acrylic pet portrait, hand-painted",
    price: SITE.price,
    image: {
      src: "/paintings/dog3-thumb.webp",
      alt: "Example: hand-painted acrylic portrait of “Blue,” a blue-eyed dog with white, brown, and copper fur built from short hatched strokes on cream paper.",
      width: 715,
      height: 891,
    },
  },
  {
    name: "Custom hand-painted pet portrait, vibrant acrylic",
    price: "$70",
    image: {
      src: "/paintings/the-gaurdians-thumb.webp",
      alt: "Example: “The Gaurdians,” a hand-painted acrylic take on “American Gothic” with two flat-faced dogs — one in a brown dotted dress with a white collar, one in overalls beside a pitchfork — in front of a red farmhouse under a bright blue sky.",
      width: 715,
      height: 881,
    },
  },
  {
    name: "Custom hand-painted pet portrait ornament, 4×4 wood",
    price: "$40",
    image: {
      src: "/paintings/pet-portrait-ornament.jpg",
      alt: "Two hand-painted round wood-slice ornaments on red ribbons: a portrait of a tan-and-white dog with a pink nose and green collar on a blue background, and a dotted paw print with snowflakes and the name “Boey” over 2026.",
      width: 1107,
      height: 745,
    },
  },
  {
    name: "Hand-painted pet paw print ornament with custom name & year",
    price: SITE.ornamentPrice,
    image: {
      src: "/paintings/paw-print-name-ornament.jpg",
      alt: "Two hand-painted round wood ornaments on twine loops: a rainbow-dotted paw print with the name “Rocky” on hot pink, and “2026” in white on green.",
      width: 746,
      height: 746,
    },
  },
];
