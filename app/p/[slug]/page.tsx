import { headers } from "next/headers";
import { notFound } from "next/navigation";
import ProductView from "@/components/product-view";
import { PRODUCTS, pageBySlug } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pageBySlug(slug);
  if (!page) notFound();

  console.log(
    JSON.stringify({
      event: "product_view",
      slug,
      listing: page.listingCode,
      experimentId: page.experimentId,
      treatment: page.treatment,
      userAgent: (await headers()).get("user-agent"),
      at: new Date().toISOString(),
    }),
  );

  return (
    <ProductView
      product={PRODUCTS[page.productId]}
      brandName="Tallowfin"
      treatment={page.treatment}
      slug={slug}
      policyPdf="/tallowfin-returns.pdf"
      back={{ href: `/c/${page.listingCode}`, label: "← All bottles" }}
    />
  );
}
