"use client";

import Link from "next/link";
import { useState } from "react";
import { type CartItem, readCart, writeCart } from "@/lib/cart";

export default function AddToCart({ slug, name }: { slug: string; name: string }) {
  const [added, setAdded] = useState(false);

  const add = () => {
    const cart = readCart();
    const existing = cart.find((item) => item.slug === slug);
    const next: CartItem[] = existing
      ? cart.map((item) => (item.slug === slug ? { ...item, quantity: item.quantity + 1 } : item))
      : [...cart, { slug, name, quantity: 1 }];
    writeCart(next);
    fetch("/api/cart-event", { method: "POST", body: JSON.stringify({ slug }) });
    setAdded(true);
  };

  return (
    <p>
      <button type="button" className="btn" onClick={add}>
        Add to cart
      </button>{" "}
      {added && (
        <span className="muted">
          Added. <Link href="/cart">View cart</Link>
        </span>
      )}
    </p>
  );
}
