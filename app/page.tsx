import Link from "next/link";
import BottleImage from "@/components/bottle-image";
import ProductGrid from "@/components/product-grid";
import { currentBrand } from "@/lib/brand";
import { LISTINGS, PRICE_USD, PRODUCTS } from "@/lib/catalog";
import { MATCHES } from "@/lib/head-to-head";

export const dynamic = "force-dynamic";

const HOME_LISTING = LISTINGS.find((listing) => listing.experimentId === "e00" && listing.rotation === 0)!;
const BASELINE_MATCH = MATCHES.find((match) => match.testId === "h00" && match.rotation === 0)!;

export default async function Home() {
  const brand = await currentBrand();
  if (brand.id === "tallowfin") return <ProductGrid listing={HOME_LISTING} />;
  return (
    <div>
      <h1>Insulated bottles</h1>
      <div className="cards">
        <Link href={`/h/${BASELINE_MATCH.code}`} className="card">
          <span className="photo ridge">
            <BottleImage product={PRODUCTS.ridge} label={brand.name.toUpperCase()} />
          </span>
          <strong>{brand.productName}</strong>
          <span>{`$${PRICE_USD}.00`}</span>
        </Link>
      </div>
    </div>
  );
}
