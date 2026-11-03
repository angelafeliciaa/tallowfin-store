import Link from "next/link";
import { PAGES, PRICE_USD, PRODUCTS } from "@/lib/catalog";

const baseline = PAGES.filter((page) => page.experimentId === "e0" && page.arm === "a");

export default function Home() {
  return (
    <div>
      <h1>Insulated bottles</h1>
      <p className="muted">Two colors, same bottle.</p>
      <div className="cards">
        {baseline.map((page) => {
          const product = PRODUCTS[page.productId];
          return (
            <Link key={page.slug} href={`/p/${page.slug}`} className="card">
              <div className={`photo ${product.id}`}>{product.color}</div>
              <strong>{product.name}</strong>
              <span>${PRICE_USD}.00</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
