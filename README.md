# Tallowfin test store

A research test store for The Prompting Company's agent shopping study. Two near-identical product pages differ in one variable per experiment, so we can see what changes how AI shopping agents (Grok Bot, Muse) pick, quote, and add to cart.

Experiments and page slugs live in `lib/catalog.ts`. Add-to-cart clicks are logged as `add_to_cart` JSON lines in the Vercel function logs.

Checkout is disabled and every page is `noindex`.
