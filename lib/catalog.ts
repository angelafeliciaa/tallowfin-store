export type ProductId = "ridge" | "coast" | "pine" | "ember";

export type Product = {
  id: ProductId;
  name: string;
  color: string;
};

export const PRODUCTS: Record<ProductId, Product> = {
  ridge: { id: "ridge", name: "Tallowfin Ridge Bottle, 24 oz", color: "Slate" },
  coast: { id: "coast", name: "Tallowfin Coast Bottle, 24 oz", color: "Sand" },
  pine: { id: "pine", name: "Tallowfin Pine Bottle, 24 oz", color: "Forest" },
  ember: { id: "ember", name: "Tallowfin Ember Bottle, 24 oz", color: "Clay" },
};

const PRODUCT_ORDER: ProductId[] = ["ridge", "coast", "pine", "ember"];

export const TAGLINE = "Double-wall insulated steel bottle with a leakproof chug lid.";
export const PRICE_USD = 34;
export const MEMBER_PRICE_USD = 29;
export const LOW_STOCK_COUNT = 3;
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
  | "slow"
  | "badge"
  | "popup"
  | "low-stock"
  | "out-of-stock"
  | "stock-conflict"
  | "signin-cart"
  | "member-price";

export type Experiment = { id: string; treatment: Treatment; group: string; question: string };

export const EXPERIMENTS: Experiment[] = [
  { id: "e00", treatment: "none", group: "Baseline", question: "Four identical bottles (A/A)" },
  { id: "e01", treatment: "js-price", group: "Page setup", question: "Price only rendered by JavaScript, no product data" },
  { id: "e02", treatment: "no-jsonld", group: "Page setup", question: "No Product JSON-LD" },
  { id: "e03", treatment: "pdf-policy", group: "Page setup", question: "Return policy only in a linked PDF" },
  { id: "e04", treatment: "slow", group: "Page setup", question: "Product page responds 3 seconds slower" },
  { id: "e05", treatment: "challenge", group: "Bot access", question: "Bot challenge before the product page" },
  { id: "e06", treatment: "low-stock", group: "Inventory", question: "Only 3 left in stock" },
  { id: "e07", treatment: "out-of-stock", group: "Inventory", question: "Sold out" },
  { id: "e08", treatment: "stock-conflict", group: "Inventory", question: "Page says sold out, product data says in stock" },
  { id: "e09", treatment: "signin-cart", group: "Sign-in", question: "Sign-in required to add to cart" },
  { id: "e10", treatment: "member-price", group: "Sign-in", question: "Members pay $29, sign in to unlock" },
  { id: "e11", treatment: "badge", group: "Persuasion", question: "Best seller badge" },
  { id: "e12", treatment: "popup", group: "Persuasion", question: "Email pop-up on the product page" },
];

export type Listing = {
  code: string;
  experimentId: string;
  rotation: number;
  treatment: Treatment;
  treatedProduct: ProductId;
  order: ProductId[];
};

export type ProductPage = {
  slug: string;
  listingCode: string;
  experimentId: string;
  productId: ProductId;
  treatment: Treatment;
};

const ROTATIONS = 4;

// Rotation r treats product r and shifts the grid by 2r, so across the four rotations every
// product is treated once and the treated card sits in each of the four positions once.
const rotationOrder = (rotation: number) => {
  const shift = (2 * rotation) % ROTATIONS;
  return [...PRODUCT_ORDER.slice(shift), ...PRODUCT_ORDER.slice(0, shift)];
};

const opaqueCode = (seed: string) => {
  let hash = 2166136261;
  for (const char of seed) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return (hash >>> 0).toString(36).slice(0, 5);
};

export const LISTINGS: Listing[] = EXPERIMENTS.flatMap((experiment) =>
  Array.from({ length: ROTATIONS }, (_, rotation) => ({
    code: opaqueCode(`${experiment.id}-${rotation}`),
    experimentId: experiment.id,
    rotation,
    treatment: experiment.treatment,
    treatedProduct: PRODUCT_ORDER[rotation],
    order: rotationOrder(rotation),
  })),
);

export const PAGES: ProductPage[] = LISTINGS.flatMap((listing) =>
  PRODUCT_ORDER.map((productId) => ({
    slug: `${productId}-bottle-24oz-${listing.code}`,
    listingCode: listing.code,
    experimentId: listing.experimentId,
    productId,
    treatment: productId === listing.treatedProduct ? listing.treatment : "none",
  })),
);

export const listingByCode = (code: string) => LISTINGS.find((listing) => listing.code === code);
export const pageBySlug = (slug: string) => PAGES.find((page) => page.slug === slug);
export const pageFor = (listingCode: string, productId: ProductId) =>
  PAGES.find((page) => page.listingCode === listingCode && page.productId === productId)!;

export type StockState = "in-stock" | "low-stock" | "sold-out";

export const stockShown = (treatment: Treatment): StockState =>
  treatment === "low-stock" ? "low-stock" : treatment === "out-of-stock" || treatment === "stock-conflict" ? "sold-out" : "in-stock";

export const stockInData = (treatment: Treatment) =>
  treatment === "low-stock"
    ? "https://schema.org/LimitedAvailability"
    : treatment === "out-of-stock"
      ? "https://schema.org/OutOfStock"
      : "https://schema.org/InStock";
