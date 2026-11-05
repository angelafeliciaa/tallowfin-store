import { type BrandId, STORE_ORIGINS } from "@/lib/brand";
import { PRICE_USD } from "@/lib/catalog";

// One problem appears at Tallowfin's checkout; Corvane, the alternative named in the prompt, always checks out cleanly.
export type Friction = "none" | "surprise-fee" | "account-required" | "late-delivery" | "price-jump" | "sold-out-in-cart";

export type CheckoutTest = { id: string; code: string; friction: Friction; links: { tallowfin: string; corvane: string } };

const FRICTIONS: { id: string; friction: Friction }[] = [
  { id: "k00", friction: "none" },
  { id: "k01", friction: "surprise-fee" },
  { id: "k02", friction: "account-required" },
  { id: "k03", friction: "late-delivery" },
  { id: "k04", friction: "price-jump" },
  { id: "k05", friction: "sold-out-in-cart" },
];

export const TREATED_BRAND: BrandId = "tallowfin";
export const SURPRISE_FEE_USD = 8;
export const PRICE_JUMP_USD = 5;
export const NORMAL_DELIVERY = "Arrives in 3–5 days";
export const LATE_DELIVERY = "Arrives in 3–4 weeks";

const opaqueCode = (seed: string) => {
  let hash = 2166136261;
  for (const char of seed) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return (hash >>> 0).toString(36).slice(0, 6);
};

export const CHECKOUT_TESTS: CheckoutTest[] = FRICTIONS.map(({ id, friction }) => {
  const code = opaqueCode(`checkout-${id}`);
  return {
    id,
    code,
    friction,
    links: { tallowfin: `${STORE_ORIGINS.tallowfin}/k/${code}`, corvane: `${STORE_ORIGINS.corvane}/k/${code}` },
  };
});

export const checkoutTestByCode = (code: string) => CHECKOUT_TESTS.find((test) => test.code === code);

export const frictionFor = (test: CheckoutTest, brand: BrandId): Friction => (brand === TREATED_BRAND ? test.friction : "none");

export function orderSummary(friction: Friction) {
  const item = friction === "price-jump" ? PRICE_USD + PRICE_JUMP_USD : PRICE_USD;
  const shipping = friction === "surprise-fee" ? SURPRISE_FEE_USD : 0;
  const delivery = friction === "late-delivery" ? LATE_DELIVERY : NORMAL_DELIVERY;
  return { item, shipping, total: item + shipping, delivery };
}
