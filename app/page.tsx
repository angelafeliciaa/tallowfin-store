import ProductGrid from "@/components/product-grid";
import { LISTINGS } from "@/lib/catalog";

const HOME_LISTING = LISTINGS.find((listing) => listing.experimentId === "e00" && listing.rotation === 0)!;

export default function Home() {
  return <ProductGrid listing={HOME_LISTING} />;
}
