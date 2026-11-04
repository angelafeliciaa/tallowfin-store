import Link from "next/link";
import BottleImage from "@/components/bottle-image";
import PriceLine from "@/components/price-line";
import StockLine from "@/components/stock-line";
import { type Listing, PRODUCTS, pageFor, stockShown } from "@/lib/catalog";

export default function ProductGrid({ listing }: { listing: Listing }) {
  return (
    <div>
      <h1>Insulated bottles</h1>
      <p className="muted">Our 24 oz insulated bottle in {listing.order.length === 8 ? "eight" : "four"} colors.</p>
      <div className="cards">
        {listing.order.map((productId) => {
          const product = PRODUCTS[productId];
          const page = pageFor(listing.code, productId);
          return (
            <div key={page.slug} className="card">
              <Link href={`/p/${page.slug}`} className={`photo ${product.id}`}>
                <BottleImage product={product} />
              </Link>
              {page.treatment === "badge" && <span className="badge">Best seller</span>}
              <Link href={`/p/${page.slug}`}>
                <strong>{product.name}</strong>
              </Link>
              <PriceLine treatment={page.treatment} slug={page.slug} />
              <StockLine stock={stockShown(page.treatment)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
