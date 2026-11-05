import { headers } from "next/headers";
import { notFound } from "next/navigation";
import ProductView from "@/components/product-view";
import { currentBrand } from "@/lib/brand";
import { PRODUCTS } from "@/lib/catalog";
import { checkoutSlug } from "@/lib/cart";
import { checkoutTestByCode, frictionFor } from "@/lib/checkout-test";

export const dynamic = "force-dynamic";

export default async function CheckoutTestProductPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const test = checkoutTestByCode(code);
  if (!test) notFound();
  const brand = await currentBrand();
  const slug = checkoutSlug(code, brand.id);

  console.log(
    JSON.stringify({
      event: "checkout_test_product_view",
      slug,
      testId: test.id,
      brand: brand.id,
      friction: frictionFor(test, brand.id),
      userAgent: (await headers()).get("user-agent"),
      at: new Date().toISOString(),
    }),
  );

  return (
    <ProductView
      product={{ ...PRODUCTS.ridge, name: brand.productName }}
      brandName={brand.name}
      treatment="none"
      slug={slug}
      policyPdf={`/${brand.id}-returns.pdf`}
    />
  );
}
