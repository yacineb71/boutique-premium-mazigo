import { describe, expect, it } from "vitest";
import { calculateIndicativeMargin, isAliExpressProductUrl, isValidSupplierCost } from "@/lib/supplierValidation";

describe("supplier form validation", () => {
  it("accepts AliExpress product URLs and rejects unrelated domains", () => {
    expect(isAliExpressProductUrl("https://www.aliexpress.com/item/100500123" )).toBe(true);
    expect(isAliExpressProductUrl("https://example.com/product" )).toBe(false);
  });

  it("accepts positive decimal supplier costs", () => {
    expect(isValidSupplierCost("12.50")).toBe(true);
    expect(isValidSupplierCost("0")).toBe(true);
    expect(isValidSupplierCost("12.500")).toBe(false);
    expect(isValidSupplierCost("-2")).toBe(false);
  });

  it("calculates an admin-only indicative margin", () => {
    expect(calculateIndicativeMargin(29.99, 12.5)).toEqual({ amount: 17.49, percent: expect.closeTo(58.3194, 3) });
    expect(calculateIndicativeMargin(0, 12)).toBeNull();
  });
});
