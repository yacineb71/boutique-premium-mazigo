import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  stripe: { checkout: { sessions: { create: vi.fn(), retrieve: vi.fn() } } },
  createOrderWithItems: vi.fn(),
  markOrderPaidByStripeSession: vi.fn(),
}));

vi.mock("stripe", () => ({ default: vi.fn(() => mocks.stripe) }));
vi.mock("@/../../server/db", () => ({
  createOrderWithItems: mocks.createOrderWithItems,
  markOrderPaidByStripeSession: mocks.markOrderPaidByStripeSession,
}));

import { checkoutRouter } from "@/../../server/routers/checkout";

describe("checkout to manual fulfillment", () => {
  const context = {
    req: { headers: { origin: "https://mazigho.example" } },
    res: {},
    user: { id: 42, name: "Client", email: "client@example.com", role: "user" },
  } as never;

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.stripe.checkout.sessions.create.mockResolvedValue({ id: "cs_test_manual", url: "https://checkout.stripe.test/session" });
    mocks.stripe.checkout.sessions.retrieve.mockResolvedValue({ payment_status: "paid", customer_email: "client@example.com", amount_total: 2990 });
  });

  it("creates the internal order draft before redirecting to Stripe", async () => {
    const caller = checkoutRouter.createCaller(context);
    const result = await caller.createSession({ cartItems: [{ id: 1, name: "Produit", price: 29.9, quantity: 1, category: "Cadeaux" }] });
    expect(result.sessionId).toBe("cs_test_manual");
    expect(mocks.createOrderWithItems).toHaveBeenCalledWith(expect.objectContaining({ userId: 42, stripeSessionId: "cs_test_manual", status: "awaiting_payment", total: "29.90" }), expect.arrayContaining([expect.objectContaining({ productId: 1, quantity: 1 })]));
  });

  it("moves the internal order to to_order when Stripe confirms payment", async () => {
    const caller = checkoutRouter.createCaller(context);
    const result = await caller.getSessionStatus({ sessionId: "cs_test_manual" });
    expect(result.status).toBe("paid");
    expect(mocks.markOrderPaidByStripeSession).toHaveBeenCalledWith("cs_test_manual");
  });
});
