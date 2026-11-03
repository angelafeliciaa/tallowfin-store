import { type BrandId, STORE_ORIGINS } from "@/lib/brand";
import type { Treatment } from "@/lib/catalog";

export type MatchTreatment = Treatment | "robots";

export type Match = {
  code: string;
  testId: string;
  treatment: MatchTreatment;
  rotation: number;
  treatedBrand: BrandId;
  links: [string, string];
};

const TESTS: { id: string; treatment: MatchTreatment }[] = [
  { id: "h00", treatment: "none" },
  { id: "h01", treatment: "js-price" },
  { id: "h02", treatment: "no-jsonld" },
  { id: "h03", treatment: "pdf-policy" },
  { id: "h04", treatment: "slow" },
  { id: "h05", treatment: "challenge" },
  { id: "h06", treatment: "low-stock" },
  { id: "h07", treatment: "stock-conflict" },
  { id: "h08", treatment: "signin-cart" },
  { id: "h09", treatment: "member-price" },
  { id: "h10", treatment: "badge" },
  { id: "h11", treatment: "popup" },
  { id: "h12", treatment: "robots" },
];

const ROTATIONS = 4;

const opaqueCode = (seed: string) => {
  let hash = 2166136261;
  for (const char of seed) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return (hash >>> 0).toString(36).slice(0, 6);
};

// Rotations 0–1 treat Tallowfin and 2–3 treat Corvane; even rotations list Tallowfin first.
// Robots can only differ by domain, so its Tallowfin link always points at the strict store.
export const MATCHES: Match[] = TESTS.flatMap((test) =>
  Array.from({ length: ROTATIONS }, (_, rotation) => {
    const code = opaqueCode(`h2h-${test.id}-${rotation}`);
    const treatedBrand: BrandId = test.treatment === "robots" || rotation < 2 ? "tallowfin" : "corvane";
    const tallowfinOrigin = test.treatment === "robots" ? STORE_ORIGINS.tallowfinStrict : STORE_ORIGINS.tallowfin;
    const tallowfin = `${tallowfinOrigin}/h/${code}`;
    const corvane = `${STORE_ORIGINS.corvane}/h/${code}`;
    return {
      code,
      testId: test.id,
      treatment: test.treatment,
      rotation,
      treatedBrand,
      links: rotation % 2 === 0 ? [tallowfin, corvane] : [corvane, tallowfin],
    } satisfies Match;
  }),
);

export const matchByCode = (code: string) => MATCHES.find((match) => match.code === code);

export const pageTreatment = (match: Match, brand: BrandId): Treatment =>
  match.treatment !== "robots" && match.treatedBrand === brand ? match.treatment : "none";
