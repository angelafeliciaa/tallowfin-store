import { headers } from "next/headers";
import { notFound } from "next/navigation";
import ProductView from "@/components/product-view";
import { currentBrand } from "@/lib/brand";
import { PRODUCTS } from "@/lib/catalog";
import { matchByCode, pageTreatment } from "@/lib/head-to-head";

export const dynamic = "force-dynamic";

export default async function MatchPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const match = matchByCode(code);
  if (!match) notFound();
  const brand = await currentBrand();
  const treatment = pageTreatment(match, brand.id);
  const slug = `h-${code}-${brand.id}`;

  console.log(
    JSON.stringify({
      event: "match_view",
      slug,
      testId: match.testId,
      rotation: match.rotation,
      brand: brand.id,
      strictRobots: brand.strictRobots,
      treatment,
      userAgent: (await headers()).get("user-agent"),
      at: new Date().toISOString(),
    }),
  );

  return (
    <ProductView
      product={{ ...PRODUCTS.ridge, name: brand.productName }}
      brandName={brand.name}
      treatment={treatment}
      slug={slug}
      policyPdf={`/${brand.id}-returns.pdf`}
    />
  );
}
