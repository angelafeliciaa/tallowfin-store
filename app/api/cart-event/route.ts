import { pageBySlug } from "@/lib/catalog";

export async function POST(request: Request) {
  const { slug } = (await request.json().catch(() => ({}))) as { slug?: string };
  const page = slug ? pageBySlug(slug) : undefined;
  console.log(
    JSON.stringify({
      event: "add_to_cart",
      slug,
      experimentId: page?.experimentId,
      arm: page?.arm,
      treatment: page?.treatment,
      userAgent: request.headers.get("user-agent"),
      at: new Date().toISOString(),
    }),
  );
  return Response.json({ ok: true });
}
