import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  markOrderPaidByStripeSession: vi.fn(),
}));

vi.mock("../db", () => ({
  markOrderPaidByStripeSession: mocks.markOrderPaidByStripeSession,
}));

import { fulfillCheckoutSession } from "./webhook";

describe("Stripe webhook fulfillment", () => {
  beforeEach(() => vi.clearAllMocks());

  it("marks a paid checkout session for fulfillment", async () => {
    await expect(fulfillCheckoutSession("cs_test_twint")).resolves.toBe(true);
    expect(mocks.markOrderPaidByStripeSession).toHaveBeenCalledWith("cs_test_twint");
  });

  it("ignores an empty session id safely", async () => {
    await expect(fulfillCheckoutSession("")).resolves.toBe(false);
    expect(mocks.markOrderPaidByStripeSession).not.toHaveBeenCalled();
  });
});
