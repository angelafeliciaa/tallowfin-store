import { headers } from "next/headers";

export type BrandId = "tallowfin" | "corvane";

export type Brand = {
  id: BrandId;
  name: string;
  productName: string;
  // A strict store disallows every named AI agent in robots.txt; it only exists for the robots head-to-head.
  strictRobots: boolean;
};

const TALLOWFIN: Brand = { id: "tallowfin", name: "Tallowfin", productName: "Tallowfin Ridge Bottle, 24 oz", strictRobots: false };
const TALLOWFIN_STRICT: Brand = { ...TALLOWFIN, strictRobots: true };
const CORVANE: Brand = { id: "corvane", name: "Corvane", productName: "Corvane Trailhead Bottle, 24 oz", strictRobots: false };

export const STORE_ORIGINS = {
  tallowfin: "https://tallowfin-store.vercel.app",
  tallowfinStrict: "https://tallowfin-shop.vercel.app",
  corvane: "https://corvane-goods.vercel.app",
} as const;

export const brandForHost = (host: string | null): Brand => {
  if (host?.startsWith("corvane-goods")) return CORVANE;
  if (host?.startsWith("tallowfin-shop")) return TALLOWFIN_STRICT;
  return TALLOWFIN;
};

export const currentBrand = async () => brandForHost((await headers()).get("host"));
