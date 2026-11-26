import Stripe from "stripe"

// Create a Stripe client instance using the secret key from environment variables
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Pin the Stripe API version so behavior matches the expected API version
  apiVersion: "2026-11-18.endive",

  appInfo: {
    // Name of the application using Stripe
    name: "Todo App",

    // Current version of the application
    version: "0.1.0",
  },
})
