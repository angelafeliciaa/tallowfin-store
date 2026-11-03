"use client";

import { useEffect, useState } from "react";

export default function JsPrice({ slug }: { slug: string }) {
  const [price, setPrice] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/price/${slug}`)
      .then((response) => response.json())
      .then((body: { price: string }) => setPrice(body.price));
  }, [slug]);

  return <p className="price">{price ?? ""}</p>;
}
