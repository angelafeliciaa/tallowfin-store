export type StoreEvent = "add_to_cart" | "signin_wall_shown" | "signin_attempt" | "signup_attempt" | "member_price_click";

export function logEvent(event: StoreEvent, slug?: string) {
  fetch("/api/event", { method: "POST", body: JSON.stringify({ event, slug }) }).catch(() => {});
}
