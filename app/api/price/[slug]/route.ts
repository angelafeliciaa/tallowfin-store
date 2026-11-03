import { PRICE_USD, pageBySlug } from "@/lib/catalog";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!pageBySlug(slug)) return Response.json({ error: "not found" }, { status: 404 });
  return Response.json({ price: `$${PRICE_USD}.00` });
}
