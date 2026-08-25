import { describe, expect, it } from "vitest";
import { buildOrderDraft, paymentStatusToFulfillment } from "@/../../server/routers/checkout";
import { FULFILLMENT_STATUS_VALUES } from "@/../../server/routers/orders";

describe("manual fulfillment contract", () => {
  it("keeps the payment-to-supplier workflow ordered", () => {
    expect(FULFILLMENT_STATUS_VALUES).toEqual(["awaiting_payment", "paid", "to_order", "ordered", "shipped", "delivered", "cancelled"]);
    expect(FULFILLMENT_STATUS_VALUES.indexOf("to_order")).toBeGreaterThan(FULFILLMENT_STATUS_VALUES.indexOf("paid"));
  });

  it("builds an internal order draft from a paid checkout cart", () => {
    const draft = buildOrderDraft({ id: 7, email: "client@example.com", name: "Client" }, [{ id: 2, name: "Produit", price: 19.9, quantity: 2, category: "Cadeaux" }], "cs_test_123", "MZG-TEST");
    expect(draft.order).toMatchObject({ orderNumber: "MZG-TEST", userId: 7, stripeSessionId: "cs_test_123", status: "awaiting_payment", total: "39.80" });
    expect(draft.items[0]).toMatchObject({ productId: 2, quantity: 2, unitPrice: "19.90", supplierUrl: null, supplierCost: null });
    expect(paymentStatusToFulfillment("paid")).toBe("to_order");
    expect(paymentStatusToFulfillment("unpaid")).toBeNull();
  });

  it("keeps supplier-only data out of the public status contract", () => {
    expect(FULFILLMENT_STATUS_VALUES).not.toContain("supplierUrl");
    expect(FULFILLMENT_STATUS_VALUES).not.toContain("supplierCost");
    expect(FULFILLMENT_STATUS_VALUES).not.toContain("internalNote");
  });
});
