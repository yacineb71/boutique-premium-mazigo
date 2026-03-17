import { useCallback, useState } from "react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const saveCart = useCallback((newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem("cart", JSON.stringify(newItems));
  }, []);

  const addToCart = useCallback(
    (product: { id: number; name: string; price: number; image: string }) => {
      setItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === product.id);
        let newItems: CartItem[];

        if (existingItem) {
          newItems = prevItems.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          newItems = [...prevItems, { ...product, quantity: 1 }];
        }

        localStorage.setItem("cart", JSON.stringify(newItems));
        return newItems;
      });
    },
    []
  );

  const removeFromCart = useCallback((productId: number) => {
    setItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.id !== productId);
      localStorage.setItem("cart", JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    setItems((prevItems) => {
      const newItems =
        quantity <= 0
          ? prevItems.filter((item) => item.id !== productId)
          : prevItems.map((item) =>
              item.id === productId ? { ...item, quantity } : item
            );
      localStorage.setItem("cart", JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem("cart");
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    itemCount,
  };
}
