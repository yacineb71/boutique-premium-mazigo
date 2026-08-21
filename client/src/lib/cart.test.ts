import { describe, expect, it } from "vitest";
import {
  addItem,
  getCartItemCount,
  getCartTotal,
  parseStoredCart,
  removeItem,
  setItemQuantity,
} from "./cart";

const product = {
  id: 1,
  name: "T-Shirt Premium",
  price: 29.99,
  image: "👕",
};

describe("cart operations", () => {
  it("adds a product and increments an existing product", () => {
    const first = addItem([], product);
    const second = addItem(first, product);

    expect(second).toHaveLength(1);
    expect(second[0]?.quantity).toBe(2);
  });

  it("updates quantity and removes an item at zero", () => {
    const items = addItem([], product);

    expect(setItemQuantity(items, 1, 3)[0]?.quantity).toBe(3);
    expect(setItemQuantity(items, 1, 0)).toEqual([]);
    expect(removeItem(items, 1)).toEqual([]);
  });

  it("calculates totals and item count", () => {
    const items = setItemQuantity(addItem([], product), 1, 2);

    expect(getCartItemCount(items)).toBe(2);
    expect(getCartTotal(items)).toBeCloseTo(59.98, 2);
  });

  it("ignores malformed persisted cart data", () => {
    expect(parseStoredCart("not-json")).toEqual([]);
    expect(parseStoredCart(JSON.stringify([{ id: 1 }, product]))).toEqual([]);
  });
});
