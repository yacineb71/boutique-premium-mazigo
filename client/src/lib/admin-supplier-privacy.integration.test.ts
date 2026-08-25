import { describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  getProductSupplierMeta: vi.fn().mockResolvedValue({ productId: 1, supplierUrl: "https://www.aliexpress.com/item/100500123", supplierCost: "12.50" }),
  upsertProductSupplierMeta: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/../../server/db", () => dbMocks);

import { productsRouter } from "@/../../server/routers/products";

describe("supplier metadata privacy", () => {
  const adminContext = { user: { id: 1, role: "admin" }, req: {}, res: {} } as never;
  const userContext = { user: { id: 2, role: "user" }, req: {}, res: {} } as never;

  it("does not expose supplier fields through public product data", async () => {
    const product = await productsRouter.createCaller({} as never).getById({ id: 1 });
    expect(product).not.toHaveProperty("supplierUrl");
    expect(product).not.toHaveProperty("supplierCost");
  });

  it("allows supplier metadata only to an admin", async () => {
    const admin = productsRouter.createCaller(adminContext);
    await expect(admin.adminSupplierMeta({ productId: 1 })).resolves.toMatchObject({ productId: 1 });
    await expect(admin.upsertSupplierMeta({ productId: 1, supplierUrl: "https://www.aliexpress.com/item/100500123", supplierCost: "12.50" })).resolves.toEqual({ success: true });
    await expect(productsRouter.createCaller(userContext).adminSupplierMeta({ productId: 1 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
