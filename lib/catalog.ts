export type ProductId = "ridge" | "coast";

export type Product = {
  id: ProductId;
  name: string;
  tagline: string;
  color: string;
};

export const PRODUCTS: Record<ProductId, Product> = {
  ridge: {
    id: "ridge",
    name: "Tallowfin Ridge Bottle, 24 oz",
    tagline: "Double-wall insulated steel bottle with a leakproof chug lid.",
    color: "Slate",
  },
  coast: {
    id: "coast",
    name: "Tallowfin Coast Bottle, 24 oz",
    tagline: "Double-wall insulated steel bottle with a leakproof chug lid.",
    color: "Sand",
  },
};

export const PRICE_USD = 34;
export const RETURN_POLICY = "Free returns within 60 days of delivery, even if used.";
export const SHIPPING_POLICY = "Free shipping on every US order. Ships in 1–2 business days.";

export const SPECS = [
  "Holds 24 oz (710 ml)",
  "Keeps drinks cold for 24 hours, hot for 12",
  "18/8 stainless steel, BPA-free lid",
  "Fits most car cup holders",
  "Dishwasher-safe lid; hand-wash the bottle",
];

export type Treatment =
  | "none"
  | "js-price"
  | "no-jsonld"
  | "challenge"
  | "pdf-policy"
  | "badge"
  | "popup"
  | "slow";

export type Experiment = {
  id: string;
  treatment: Treatment;
  question: string;
};

export const EXPERIMENTS: Experiment[] = [
  { id: "e0", treatment: "none", question: "Baseline: two identical pages (A/A)" },
  { id: "e1", treatment: "js-price", question: "Price only rendered by JavaScript" },
  { id: "e2", treatment: "no-jsonld", question: "No Product JSON-LD" },
  { id: "e3", treatment: "challenge", question: "Bot challenge before the page" },
  { id: "e4", treatment: "pdf-policy", question: "Return policy only in a linked PDF" },
  { id: "e5", treatment: "badge", question: "Free shipping and returns badge" },
  { id: "e6", treatment: "popup", question: "Email pop-up on load" },
  { id: "e7", treatment: "slow", question: "Page responds 3 seconds slower" },
];

export type ProductPage = {
  slug: string;
  experimentId: string;
  arm: "a" | "b";
  productId: ProductId;
  treatment: Treatment;
};

// Each experiment runs in two arms so the treatment lands on Ridge in one and Coast in the other.
// Slugs carry a short opaque code so the URL never reveals which page is treated.
const CODES: Record<string, [string, string, string, string]> = {
  e0: ["k4m2", "p7d9", "x3q8", "h6w1"],
  e1: ["r8t5", "c2n7", "v9j4", "m1z6"],
  e2: ["q5b3", "w8f2", "d4k9", "t7y1"],
  e3: ["n6c8", "g3s5", "b9r2", "y4h7"],
  e4: ["f1x6", "j8m3", "s5v9", "l2p4"],
  e5: ["u7g2", "a4d8", "z1k5", "e9t3"],
  e6: ["h3w9", "o6b1", "i8n4", "c5r7"],
  e7: ["m9q2", "s3y6", "k7f8", "w2j5"],
};

export const PAGES: ProductPage[] = EXPERIMENTS.flatMap((experiment) => {
  const [aRidge, aCoast, bRidge, bCoast] = CODES[experiment.id];
  return [
    { slug: `ridge-bottle-24oz-${aRidge}`, experimentId: experiment.id, arm: "a", productId: "ridge", treatment: experiment.treatment },
    { slug: `coast-bottle-24oz-${aCoast}`, experimentId: experiment.id, arm: "a", productId: "coast", treatment: "none" },
    { slug: `ridge-bottle-24oz-${bRidge}`, experimentId: experiment.id, arm: "b", productId: "ridge", treatment: "none" },
    { slug: `coast-bottle-24oz-${bCoast}`, experimentId: experiment.id, arm: "b", productId: "coast", treatment: experiment.treatment },
  ] satisfies ProductPage[];
});

export const pageBySlug = (slug: string) => PAGES.find((page) => page.slug === slug);
