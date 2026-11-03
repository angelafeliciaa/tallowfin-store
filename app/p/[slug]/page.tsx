import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import AddToCart from "@/components/add-to-cart";
import Challenge from "@/components/challenge";
import EmailPopup from "@/components/email-popup";
import JsPrice from "@/components/js-price";
import {
  PRICE_USD,
  PRODUCTS,
  RETURN_POLICY,
  SHIPPING_POLICY,
  SPECS,
  pageBySlug,
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

  if (treatment === "slow") await new Promise((resolve) => setTimeout(resolve, SLOW_RESPONSE_MS));
  if (treatment === "challenge" && !(await cookies()).get(VERIFIED_COOKIE)) return <Challenge />;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.tagline,
    brand: { "@type": "Brand", name: "Tallowfin" },
    color: product.color,
    offers: {
      "@type": "Offer",
      price: PRICE_USD.toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      shippingDetails: { "@type": "OfferShippingDetails", shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "USD" } },
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
      <div className="product">
        <div className={`photo ${product.id}`}>{product.color}</div>
        <div>
          {treatment === "badge" && <span className="badge">Free shipping · Free 60-day returns</span>}
          <h1>{product.name}</h1>
          <p className="muted">{product.tagline} Color: {product.color}.</p>
          {treatment === "js-price" ? <JsPrice slug={slug} /> : <p className="price">${PRICE_USD}.00</p>}
          <AddToCart slug={slug} name={product.name} />
          <ul>
            {SPECS.map((spec) => (
              <li key={spec}>{spec}</li>
            ))}
          </ul>
          <div className="policy">
            <p><strong>Shipping:</strong> {SHIPPING_POLICY}</p>
            {treatment === "pdf-policy" ? (
              <p><strong>Returns:</strong> See our <a href="/tallowfin-returns.pdf">return policy (PDF)</a>.</p>
            ) : (
              <p><strong>Returns:</strong> {RETURN_POLICY}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
