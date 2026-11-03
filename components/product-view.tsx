import { cookies } from "next/headers";
import Link from "next/link";
import AddToCart from "@/components/add-to-cart";
import BottleImage from "@/components/bottle-image";
import Challenge from "@/components/challenge";
import EmailPopup from "@/components/email-popup";
import PriceLine from "@/components/price-line";
import StockLine from "@/components/stock-line";
import {
  PRICE_USD,
  type Product,
  RETURN_POLICY,
  SHIPPING_POLICY,
  SPECS,
  TAGLINE,
  type Treatment,
  stockInData,
  stockShown,
} from "@/lib/catalog";

const SLOW_RESPONSE_MS = 3000;
const VERIFIED_COOKIE = "tf_verified";

type Props = {
  product: Product;
  brandName: string;
  treatment: Treatment;
  slug: string;
  policyPdf: string;
  back?: { href: string; label: string };
};

export default async function ProductView({ product, brandName, treatment, slug, policyPdf, back }: Props) {
  if (treatment === "slow") await new Promise((resolve) => setTimeout(resolve, SLOW_RESPONSE_MS));
  if (treatment === "challenge" && !(await cookies()).get(VERIFIED_COOKIE)) return <Challenge />;

  const stock = stockShown(treatment);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: TAGLINE,
    brand: { "@type": "Brand", name: brandName },
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
      {back && (
        <p className="muted">
          <Link href={back.href}>{back.label}</Link>
        </p>
      )}
      <div className="product">
        <div className={`photo ${product.id}`}>
          <BottleImage product={product} label={brandName.toUpperCase()} />
        </div>
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
                <strong>Returns:</strong> See our <a href={policyPdf}>return policy (PDF)</a>.
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
