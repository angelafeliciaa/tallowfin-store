"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { type CartItem, codeFromCheckoutSlug, readCart } from "@/lib/cart";
import { PRICE_USD } from "@/lib/catalog";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => setItems(readCart()), []);
  const total = items.reduce((sum, item) => sum + item.quantity * PRICE_USD, 0);
  const checkoutCode = items.map((item) => codeFromCheckoutSlug(item.slug)).find(Boolean);

  return (
    <div>
      <h1>Your cart</h1>
      {items.length === 0 ? (
        <p className="muted">Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {items.map((item) => (
              <li key={item.slug}>
                {item.name} × {item.quantity}
              </li>
            ))}
          </ul>
          <p className="price">{`Total: $${total}.00`}</p>
        </>
      )}
      {checkoutCode ? (
        <Link className="btn" href={`/k/${checkoutCode}/checkout`}>
          Checkout
        </Link>
      ) : (
        <button type="button" className="btn" disabled>
          Checkout is unavailable right now
        </button>
      )}
    </div>
  );
}
