import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

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
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const lineItems = input.cartItems.map((item) => ({
          price_data: {
            currency: "eur",
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

        return {
          sessionId: session.id,
          url: session.url,
        };
      } catch (error) {
        console.error("Stripe error:", error);
        throw new Error("Failed to create checkout session");
      }
    }),

  getSessionStatus: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      try {
        const session = await stripe.checkout.sessions.retrieve(input.sessionId);
        return {
          status: session.payment_status,
          customer_email: session.customer_email,
          total: session.amount_total,
        };
      } catch (error) {
        console.error("Stripe error:", error);
        throw new Error("Failed to retrieve session");
      }
    }),
});
