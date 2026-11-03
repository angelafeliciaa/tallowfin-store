import Link from "next/link";
import JsPrice from "@/components/js-price";
import { MEMBER_PRICE_USD, PRICE_USD, type Treatment } from "@/lib/catalog";

export default function PriceLine({ treatment, slug }: { treatment: Treatment; slug: string }) {
  if (treatment === "js-price") return <JsPrice slug={slug} />;
  return (
    <>
      <p className="price">{`$${PRICE_USD}.00`}</p>
      {treatment === "member-price" && (
        <p className="member">
          {`Members pay $${MEMBER_PRICE_USD}.00 — `}
          <Link href={`/account/signin?from=${slug}&reason=member`}>sign in to unlock</Link>
        </p>
      )}
    </>
  );
}
