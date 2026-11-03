import { cookies, headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCart from "@/components/add-to-cart";
import Challenge from "@/components/challenge";
import EmailPopup from "@/components/email-popup";
import PriceLine from "@/components/price-line";
import StockLine from "@/components/stock-line";
import {
  PRICE_USD,
  PRODUCTS,
  RETURN_POLICY,
  SHIPPING_POLICY,
  SPECS,
  TAGLINE,
  pageBySlug,
  stockInData,
  stockShown,
} from "@/lib/catalog";

export const dynamic = "force-dynamic";

const SLOW_RESPONSE_MS = 3000;
const VERIFIED_COOKIE = "tf_verified";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pageBySlug(slug);
  if (!page) notFound();
  const product = PRODUCTS[page.productId];
  const { treatment } = page;

  console.log(
    JSON.stringify({
      event: "product_view",
      slug,
      listing: page.listingCode,
      experimentId: page.experimentId,
      treatment,
      userAgent: (await headers()).get("user-agent"),
      at: new Date().toISOString(),
    }),
  );

  if (treatment === "slow") await new Promise((resolve) => setTimeout(resolve, SLOW_RESPONSE_MS));
  if (treatment === "challenge" && !(await cookies()).get(VERIFIED_COOKIE)) return <Challenge />;

  const stock = stockShown(treatment);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: TAGLINE,
    brand: { "@type": "Brand", name: "Tallowfin" },
    color: product.color,
    offers: {
      "@type": "Offer",
      price: PRICE_USD.toFixed(2),
      priceCurrency: "USD",
      availability: stockInData(treatment),
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        merchantReturnDays: 60,
        returnFees: "https://schema.org/FreeReturn",
      },
    },
  };

  return (
    <>
      {treatment !== "no-jsonld" && treatment !== "js-price" && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      {treatment === "popup" && <EmailPopup />}
      <p className="muted">
        <Link href={`/c/${page.listingCode}`}>← All bottles</Link>
      </p>
      <div className="product">
        <div className={`photo ${product.id}`}>{product.color}</div>
        <div>
          {treatment === "badge" && <span className="badge">Best seller</span>}
          <h1>{product.name}</h1>
          <p className="muted">
            {TAGLINE} Color: {product.color}.
          </p>
          <PriceLine treatment={treatment} slug={slug} />
          <StockLine stock={stock} />
          <AddToCart
            slug={slug}
            name={product.name}
            soldOut={stock === "sold-out"}
            requireSignin={treatment === "signin-cart"}
          />
          <ul>
            {SPECS.map((spec) => (
              <li key={spec}>{spec}</li>
            ))}
          </ul>
          <div className="policy">
            <p>
              <strong>Shipping:</strong> {SHIPPING_POLICY}
            </p>
            {treatment === "pdf-policy" ? (
              <p>
                <strong>Returns:</strong> See our <a href="/tallowfin-returns.pdf">return policy (PDF)</a>.
              </p>
            ) : (
              <p>
                <strong>Returns:</strong> {RETURN_POLICY}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
