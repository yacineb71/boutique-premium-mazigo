export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export type CartProduct = Omit<CartItem, "quantity">;

export function addItem(items: CartItem[], product: CartProduct): CartItem[] {
  const existingItem = items.find((item) => item.id === product.id);

  if (existingItem) {
    return items.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
    );
  }

  return [...items, { ...product, quantity: 1 }];
}

export function removeItem(items: CartItem[], productId: number): CartItem[] {
  return items.filter((item) => item.id !== productId);
}

export function setItemQuantity(
  items: CartItem[],
  productId: number,
  quantity: number
): CartItem[] {
  if (quantity <= 0) return removeItem(items, productId);

  return items.map((item) =>
    item.id === productId ? { ...item, quantity } : item
  );
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getCartItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function parseStoredCart(value: string | null): CartItem[] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is CartItem =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as CartItem).id === "number" &&
        typeof (item as CartItem).name === "string" &&
        typeof (item as CartItem).price === "number" &&
        typeof (item as CartItem).quantity === "number" &&
        typeof (item as CartItem).image === "string"
    );
  } catch {
    return [];
  }
}

export const CART_UPDATED_EVENT = "mazigho:cart-updated";

export function persistCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("cart", JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
}

export function clearPersistedCart(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("cart");
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
}

export function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  return parseStoredCart(window.localStorage.getItem("cart"));
}
