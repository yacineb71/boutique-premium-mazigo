import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import Stripe from "stripe";
import { createOrderWithItems, markOrderPaidByStripeSession } from "../db";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export function formatStripeCheckoutError(error: unknown, configured = Boolean(stripeSecretKey), operation: "create" | "retrieve" = "create") {
  const code = typeof error === "object" && error !== null && "code" in error ? String((error as { code?: unknown }).code ?? "") : "";
  if (!configured || code === "api_key_expired" || code === "authentication_required") {
    return "Le paiement en ligne est temporairement indisponible. La configuration Stripe doit être mise à jour.";
  }
  return operation === "retrieve"
    ? "Le statut du paiement n’a pas pu être vérifié. Veuillez réessayer dans quelques instants."
    : "La session de paiement n’a pas pu être créée. Veuillez réessayer dans quelques instants.";
}

type CheckoutDraftItem = { id: number; name: string; price: number; quantity: number; category: string; supplierUrl?: string };

export function paymentStatusToFulfillment(status: string) {
  return status === "paid" ? "to_order" as const : null;
}

export function buildOrderDraft(user: { id: number; email?: string | null; name?: string | null }, cartItems: CheckoutDraftItem[], sessionId: string, orderNumber: string) {
  return {
    order: {
      orderNumber,
      userId: user.id,
      stripeSessionId: sessionId,
      status: "awaiting_payment" as const,
      customerEmail: user.email || null,
      customerName: user.name || null,
      total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2),
    },
    items: cartItems.map((item) => ({
      productId: item.id,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.price.toFixed(2),
      supplierUrl: item.supplierUrl || null,
      supplierCost: null,
    })),
  };
}

export const checkoutRouter = router({
  createSession: protectedProcedure
    .input(
      z.object({
        cartItems: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
            price: z.number(),
            quantity: z.number(),
            category: z.string(),
            supplierUrl: z.string().url().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!stripe) {
        throw new TRPCError({ code: "PRECONDITION_FAILED", message: formatStripeCheckoutError(undefined, false) });
      }
      try {
        const lineItems = input.cartItems.map((item) => ({
          price_data: {
            currency: "chf",
            product_data: {
              name: item.name,
              description: item.category,
            },
            unit_amount: Math.round(item.price * 100), // Stripe expects cents
          },
          quantity: item.quantity,
        }));

        const origin = ctx.req.headers.origin || "http://localhost:3000";

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card", "twint"],
          line_items: lineItems,
          mode: "payment",
          success_url: `${origin}/orders?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/cart`,
          customer_email: ctx.user.email || undefined,
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            customer_email: ctx.user.email || "unknown",
            customer_name: ctx.user.name || "Customer",
          },
          allow_promotion_codes: true,
        });

        const orderNumber = `MZG-${Date.now().toString(36).toUpperCase()}`;
        const draft = buildOrderDraft(ctx.user, input.cartItems, session.id, orderNumber);
        await createOrderWithItems(draft.order, draft.items);

        return {
          sessionId: session.id,
          orderNumber,
          url: session.url,
        };
      } catch (error) {
        console.error("Stripe error:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: formatStripeCheckoutError(error) });
      }
    }),

  getSessionStatus: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      if (!stripe) {
        throw new TRPCError({ code: "PRECONDITION_FAILED", message: formatStripeCheckoutError(undefined, false, "retrieve") });
      }
      try {
        const session = await stripe.checkout.sessions.retrieve(input.sessionId);
        if (paymentStatusToFulfillment(session.payment_status)) {
          await markOrderPaidByStripeSession(input.sessionId);
        }
        return {
          status: session.payment_status,
          customer_email: session.customer_email,
          total: session.amount_total,
        };
      } catch (error) {
        console.error("Stripe error:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: formatStripeCheckoutError(error, Boolean(stripeSecretKey), "retrieve") });
      }
    }),
});
