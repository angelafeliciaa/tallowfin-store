export type CartItem = { slug: string; name: string; quantity: number };

const CART_KEY = "tallowfin-cart";

export function readCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? "[]") as CartItem[];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // Private windows can refuse storage; the add-to-cart event is still logged server-side.
  }
}
