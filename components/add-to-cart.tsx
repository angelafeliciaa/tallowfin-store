"use client";

import Link from "next/link";
import { useState } from "react";
import { type CartItem, readCart, writeCart } from "@/lib/cart";
import { logEvent } from "@/lib/events";

type Props = { slug: string; name: string; soldOut: boolean; requireSignin: boolean };

export default function AddToCart({ slug, name, soldOut, requireSignin }: Props) {
  const [added, setAdded] = useState(false);
  const [wall, setWall] = useState(false);

  const add = () => {
    if (requireSignin) {
      logEvent("signin_wall_shown", slug);
      setWall(true);
      return;
    }
    const cart = readCart();
    const existing = cart.find((item) => item.slug === slug);
    const next: CartItem[] = existing
      ? cart.map((item) => (item.slug === slug ? { ...item, quantity: item.quantity + 1 } : item))
      : [...cart, { slug, name, quantity: 1 }];
    writeCart(next);
    logEvent("add_to_cart", slug);
    setAdded(true);
  };

  if (soldOut) {
    return (
      <p>
        <button type="button" className="btn" disabled>
          Sold out
        </button>
      </p>
    );
  }

  return (
    <>
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
      {wall && (
        <div className="overlay" role="dialog" aria-modal="true" aria-label="Sign in to continue">
          <div className="modal">
            <button type="button" className="x" aria-label="Close" onClick={() => setWall(false)}>
              ×
            </button>
            <h2>Sign in to continue</h2>
            <p className="muted">You need a Tallowfin account to add items to your cart.</p>
            <Link className="btn" href={`/account/signin?from=${slug}&reason=cart`}>
              Sign in
            </Link>
            <Link href={`/account/create?from=${slug}`}>Create an account</Link>
          </div>
        </div>
      )}
    </>
  );
}
