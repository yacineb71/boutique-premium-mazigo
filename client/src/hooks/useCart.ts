import { useCallback, useEffect, useState } from "react";
import {
  addItem,
  CART_UPDATED_EVENT,
  clearPersistedCart,
  getCartItemCount,
  getCartTotal,
  loadCart,
  removeItem,
  setItemQuantity,
  persistCart,
  type CartItem,
} from "@/lib/cart";

export type { CartItem } from "@/lib/cart";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    const syncCart = () => setItems(loadCart());
    window.addEventListener(CART_UPDATED_EVENT, syncCart);
    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  const addToCart = useCallback(
    (product: { id: number; name: string; price: number; image: string }) => {
      setItems((previousItems) => {
        const nextItems = addItem(previousItems, product);
        persistCart(nextItems);
        return nextItems;
      });
    },
    []
  );

  const removeFromCart = useCallback((productId: number) => {
    setItems((previousItems) => {
      const nextItems = removeItem(previousItems, productId);
      persistCart(nextItems);
      return nextItems;
    });
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    setItems((previousItems) => {
      const nextItems = setItemQuantity(previousItems, productId, quantity);
      persistCart(nextItems);
      return nextItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    clearPersistedCart();
  }, []);

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total: getCartTotal(items),
    itemCount: getCartItemCount(items),
  };
}
