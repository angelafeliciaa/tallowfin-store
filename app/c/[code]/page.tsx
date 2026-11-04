import { headers } from "next/headers";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/product-grid";
import { listingByCode } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function ListingPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const listing = listingByCode(code);
  if (!listing) notFound();
  console.log(
    JSON.stringify({
      event: "listing_view",
      listing: code,
      experimentId: listing.experimentId,
      rotation: listing.rotation,
      order: listing.order,
      userAgent: (await headers()).get("user-agent"),
      at: new Date().toISOString(),
    }),
  );
  return <ProductGrid listing={listing} />;
}
