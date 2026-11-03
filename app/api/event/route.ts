import { pageBySlug } from "@/lib/catalog";

const EVENTS = new Set(["add_to_cart", "signin_wall_shown", "signin_attempt", "signup_attempt", "member_price_click"]);

export async function POST(request: Request) {
  const { event, slug } = (await request.json().catch(() => ({}))) as { event?: string; slug?: string };
  if (!event || !EVENTS.has(event)) return Response.json({ ok: false }, { status: 400 });
  const page = slug ? pageBySlug(slug) : undefined;
  console.log(
    JSON.stringify({
      event,
      slug,
      listing: page?.listingCode,
      experimentId: page?.experimentId,
      treatment: page?.treatment,
      userAgent: request.headers.get("user-agent"),
      at: new Date().toISOString(),
    }),
  );
  return Response.json({ ok: true });
}
