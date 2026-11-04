import type { Metadata } from "next";
import bench from "@/lib/bench-data.json";
import styles from "./bench.module.css";

export const metadata: Metadata = {
  title: "Shopping Bench",
  description: "Which brands personal agents pick, with and without a constraint.",
  robots: { index: false, follow: false },
};

type Share = { brand: string; count: number };
type Distribution = { n: number; runs: number; agents: Record<string, number>; shares: Share[] };
type Need = Distribution & { prompt: string; top_share: number };
type Category = { category: string; bare: Distribution; bare_prompts: string[]; needs: Need[] };

const PALETTE = ["#2f5bea", "#e8833a", "#2e9e6a", "#c94f7c", "#7a5af5", "#c9a227", "#3aa6b9", "#8c6d52"];
const OTHER_COLOR = "#d6d3cf";
const HEDGE = "It depends";
const HEDGE_COLOR = "#9a9a9a";
const MIN_SHARE_FOR_LABEL = 0.12;

function colorsFor(category: Category) {
  const totals = new Map<string, number>();
  for (const row of [category.bare, ...category.needs])
    for (const { brand, count } of row.shares) if (brand !== HEDGE) totals.set(brand, (totals.get(brand) ?? 0) + count);
  const ranked = [...totals.entries()].sort((a, b) => b[1] - a[1]).map(([brand]) => brand);
  const colors = new Map(ranked.slice(0, PALETTE.length).map((brand, i) => [brand, PALETTE[i]]));
  colors.set(HEDGE, HEDGE_COLOR);
  return (brand: string) => colors.get(brand) ?? OTHER_COLOR;
}

function StackedBar({ row, color }: { row: Distribution; color: (brand: string) => string }) {
  return (
    <div className={styles.bar}>
      {row.shares.map(({ brand, count }) => {
        const share = count / row.n;
        return (
          <span key={brand} className={styles.segment} style={{ width: `${share * 100}%`, background: color(brand) }} title={`${brand}: ${count} of ${row.n}`}>
            {share >= MIN_SHARE_FOR_LABEL ? `${brand} ${Math.round(share * 100)}%` : ""}
          </span>
        );
      })}
    </div>
  );
}

function agentNote(row: Distribution) {
  const agents = Object.entries(row.agents).map(([agent, count]) => `${agent} ${count}`).join(", ");
  return `${row.n} picks · ${agents}`;
}

export default function BenchPage() {
  const categories: Category[] = bench.categories;
  return (
    <div className={styles.page}>
      <h1>Shopping Bench</h1>
      <p className={styles.lede}>
        Who personal agents pick first. The top row of each category is a plain question with no brand and no constraint. Each row
        below adds real buyer constraints. Grok Bot, Muse and Instinct, completed runs only.
      </p>
      {categories.map((category) => {
        const color = colorsFor(category);
        return (
          <section key={category.category} className={styles.category}>
            <h2>{category.category}</h2>
            <div className={styles.row}>
              <div className={styles.label}>
                <strong>No constraint</strong>
                <span className={styles.note}>“{category.bare_prompts[0]}” and {category.bare_prompts.length - 1} more · {agentNote(category.bare)}</span>
              </div>
              <StackedBar row={category.bare} color={color} />
            </div>
            {category.needs.map((need) => (
              <div key={need.prompt} className={styles.row}>
                <div className={styles.label}>
                  <span>{need.prompt}</span>
                  <span className={styles.note}>{agentNote(need)}</span>
                </div>
                <StackedBar row={need} color={color} />
              </div>
            ))}
          </section>
        );
      })}
      <p className={styles.method}>
        The pick is the first brand named in the agent's final answer, or “It depends” when the answer opens by hedging. Rows with
        fewer than 8 picks are hidden. The plain-question rows are small and still filling in. Data as of {bench.generated.slice(0, 10)}.
      </p>
    </div>
  );
}
