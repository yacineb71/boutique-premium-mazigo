import { adminProcedure, protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getAllOrders, getOrderItems, getOrdersForUser, updateOrderFulfillment, updateOrderItemSupplier } from "../db";

export const FULFILLMENT_STATUS_VALUES = ["awaiting_payment", "paid", "to_order", "ordered", "shipped", "delivered", "cancelled"] as const;
const fulfillmentStatus = z.enum(FULFILLMENT_STATUS_VALUES);

export const ordersRouter = router({
  mine: protectedProcedure.query(({ ctx }) => getOrdersForUser(ctx.user.id)),
  adminList: adminProcedure.query(() => getAllOrders()),
  adminItems: adminProcedure.input(z.object({ orderId: z.number().int().positive() })).query(({ input }) => getOrderItems(input.orderId)),
  updateItemSupplier: adminProcedure
    .input(z.object({
      itemId: z.number().int().positive(),
      supplierUrl: z.string().url().nullable().optional(),
      supplierCost: z.string().regex(/^\d+(\.\d{1,2})?$/).nullable().optional(),
    }))
    .mutation(async ({ input }) => {
      const { itemId, ...values } = input;
      await updateOrderItemSupplier(itemId, values);
      return { success: true } as const;
    }),
  updateFulfillment: adminProcedure
    .input(z.object({
      orderId: z.number().int().positive(),
      status: fulfillmentStatus.optional(),
      supplierOrderRef: z.string().max(255).nullable().optional(),
      trackingNumber: z.string().max(255).nullable().optional(),
      trackingUrl: z.string().url().nullable().optional(),
      internalNote: z.string().max(5000).nullable().optional(),
    }))
    .mutation(async ({ input }) => {
      const { orderId, ...values } = input;
      await updateOrderFulfillment(orderId, values);
      return { success: true } as const;
    }),
});
