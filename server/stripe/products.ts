// Stripe Products Configuration
// These are the products available in the Stripe store

export const STRIPE_PRODUCTS = {
  premium_subscription: {
    name: "Premium Subscription",
    description: "Accès illimité aux produits premium",
    price: 9.99,
    currency: "chf",
    interval: "month",
  },
  one_time_purchase: {
    name: "Achat Unique",
    description: "Achat unique de produits",
    price: 0, // Variable, sera défini au checkout
    currency: "chf",
  },
};

export const getCheckoutLineItems = (cartItems: any[]) => {
  return cartItems.map((item) => ({
    price_data: {
      currency: "chf",
      product_data: {
        name: item.name,
        description: item.category,
        images: [item.image],
      },
      unit_amount: Math.round(item.price * 100), // Stripe expects cents
    },
    quantity: item.quantity,
  }));
};
