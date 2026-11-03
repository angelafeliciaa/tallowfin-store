import type { Product } from "@/lib/catalog";

const BODY_COLORS: Record<Product["id"], { body: string; shade: string }> = {
  ridge: { body: "#6f7f8c", shade: "#56646f" },
  coast: { body: "#d9c7a6", shade: "#bfa982" },
  pine: { body: "#4f6b55", shade: "#3d5443" },
  ember: { body: "#b8694c", shade: "#97523a" },
};

export default function BottleImage({ product, label = "TALLOWFIN" }: { product: Product; label?: string }) {
  const { body, shade } = BODY_COLORS[product.id];
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={`${product.name} in ${product.color}`} className="bottle">
      <ellipse cx="100" cy="186" rx="40" ry="6" fill="#000" opacity="0.08" />
      <rect x="82" y="14" width="36" height="14" rx="4" fill="#2b2b2b" />
      <path d="M86 28 h28 v10 q0 6 6 10 q14 8 14 26 v98 q0 12 -12 12 h-44 q-12 0 -12 -12 v-98 q0 -18 14 -26 q6 -4 6 -10 z" fill={body} />
      <path d="M120 48 q14 8 14 26 v98 q0 12 -12 12 h-10 q12 0 12 -12 v-98 q0 -18 -14 -26 z" fill={shade} />
      <rect x="66" y="84" width="68" height="2" fill="#000" opacity="0.08" />
      <rect x="74" y="64" width="6" height="96" rx="3" fill="#fff" opacity="0.18" />
      <text x="100" y="128" textAnchor="middle" fontFamily="-apple-system, Helvetica, sans-serif" fontSize="9" letterSpacing="2" fill="#fff" opacity="0.8">{label}</text>
    </svg>
  );
}
