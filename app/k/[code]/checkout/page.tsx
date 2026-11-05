import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { currentBrand } from "@/lib/brand";
import { PRICE_USD } from "@/lib/catalog";
import { checkoutSlug } from "@/lib/cart";
import { checkoutTestByCode, frictionFor, orderSummary } from "@/lib/checkout-test";

export const dynamic = "force-dynamic";

const usd = (amount: number) => `$${amount.toFixed(2)}`;

export default async function CheckoutTestPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const test = checkoutTestByCode(code);
  if (!test) notFound();
  const brand = await currentBrand();
  const friction = frictionFor(test, brand.id);
  const slug = checkoutSlug(code, brand.id);

  console.log(
    JSON.stringify({
      event: "checkout_view",
      slug,
      testId: test.id,
      brand: brand.id,
      friction,
      userAgent: (await headers()).get("user-agent"),
      at: new Date().toISOString(),
    }),
  );

  if (friction === "account-required") {
    return (
      <div className="gate">
        <h1>Sign in to check out</h1>
        <p className="muted">{`You need a ${brand.name} account to place an order. Guest checkout isn't available.`}</p>
        <Link className="btn" href={`/account/signin?from=${slug}&reason=checkout`}>
          Sign in
        </Link>
        <Link href={`/account/create?from=${slug}`}>Create an account</Link>
      </div>
    );
  }

  if (friction === "sold-out-in-cart") {
    return (
      <div className="gate">
        <h1>This item just sold out</h1>
        <p className="muted">{`${brand.productName} sold out while it was in your cart. We can't complete this order.`}</p>
        <Link href={`/k/${code}`}>Back to the product</Link>
      </div>
    );
  }

  const summary = orderSummary(friction);
  return (
    <div className="checkout">
      <h1>Checkout</h1>
      <section className="policy">
        <h2>Order summary</h2>
        <p>{`${brand.productName} × 1: ${usd(summary.item)}`}</p>
        {summary.item !== PRICE_USD && <p className="muted">Price updated since you added it to your cart.</p>}
        <p>{`Shipping: ${summary.shipping === 0 ? "Free" : usd(summary.shipping)}`}</p>
        <p>{summary.delivery}</p>
        <p className="price">{`Total: ${usd(summary.total)}`}</p>
      </section>
      <section className="policy">
        <h2>Shipping address</h2>
        <form className="checkout-form">
          <input aria-label="Full name" placeholder="Full name" />
          <input aria-label="Street address" placeholder="Street address" />
          <input aria-label="City" placeholder="City" />
          <input aria-label="ZIP code" placeholder="ZIP code" />
          <input aria-label="Email" placeholder="Email" />
          <button type="button" className="btn">
            Continue to payment
          </button>
        </form>
      </section>
    </div>
  );
}
