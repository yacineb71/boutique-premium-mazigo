import express, { type Express, type Request, type Response } from "express";
import Stripe from "stripe";
import { markOrderPaidByStripeSession } from "../db";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export function isStripeWebhookConfigured() {
  return Boolean(stripe && webhookSecret);
}

export async function fulfillCheckoutSession(sessionId: string) {
  if (!sessionId) return false;
  await markOrderPaidByStripeSession(sessionId);
  return true;
}

export function registerStripeWebhook(app: Express) {
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
      if (!isStripeWebhookConfigured()) {
        res.status(503).json({ error: "Stripe webhook temporairement indisponible" });
        return;
      }

      const signature = req.headers["stripe-signature"];
      if (typeof signature !== "string") {
        res.status(400).json({ error: "Signature Stripe manquante" });
        return;
      }

      try {
        const event = stripe!.webhooks.constructEvent(req.body as Buffer, signature, webhookSecret!);
        if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
          const session = event.data.object as Stripe.Checkout.Session;
          if (session.payment_status === "paid" || event.type === "checkout.session.async_payment_succeeded") {
            await fulfillCheckoutSession(session.id);
          }
        }
        res.json({ received: true });
      } catch (error) {
        console.error("Stripe webhook error:", error);
        res.status(400).json({ error: "Signature Stripe invalide" });
      }
    },
  );
}
