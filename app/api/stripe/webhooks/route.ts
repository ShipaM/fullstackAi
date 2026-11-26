import {
  manageSubscriptionStatusChange,
  updateStripeCustomer,
} from "@/actions/stripe-actions"
import { stripe } from "@/lib/stripe"
import { headers } from "next/headers"
import Stripe from "stripe"

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
])

// Handles subscription status changes.
// Extracts the subscription from the event, takes the productId from the first item,
// then calls manageSubscriptionStatusChange to update the subscription status.
async function handleSubscriptionChange(event: Stripe.Event) {
  // Extract the subscription object from the Stripe event
  const subscription = event.data.object as Stripe.Subscription

  // Get the product ID associated with the subscription
  const productId = subscription.items.data[0].price.product as string

  // Update the subscription status (logic lives in manageSubscriptionStatusChange)
  await manageSubscriptionStatusChange(
    subscription.id,
    subscription.customer as string,
    productId
  )
}

// Handles the "checkout.session.completed" event.
// Only relevant for checkout sessions where mode = "subscription".
// After a successful payment, stores the customer data (updates the Stripe customer),
// then fetches the expanded subscription and calls manageSubscriptionStatusChange.
async function handleCheckoutSession(event: Stripe.Event) {
  // Extract the checkout session object from the Stripe event
  const checkoutSession = event.data.object as Stripe.Checkout.Session

  // Make sure the session mode is subscription
  if (checkoutSession.mode === "subscription") {
    // ID of the subscription attached to the session
    const subscriptionId = checkoutSession.subscription as string

    // Update the Stripe customer data (e.g. link the customer to the subscription in our system)
    await updateStripeCustomer(
      checkoutSession.client_reference_id as string,
      subscriptionId,
      checkoutSession.customer as string
    )

    // Fetch the subscription, including the default payment method
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["default_payment_method"],
    })

    // Get the product ID associated with the subscription
    const productId = subscription.items.data[0].price.product as string

    // Update the subscription status in our system
    await manageSubscriptionStatusChange(
      subscription.id,
      subscription.customer as string,
      productId
    )
  }
}

export async function POST(req: Request) {
  // Read the request body as text
  const body = await req.text()

  // Get the Stripe signature from the headers
  const sig = (await headers()).get("Stripe-Signature") as string

  // Webhook signing secret
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  let event: Stripe.Event

  try {
    // Make sure the signature and secret are present
    if (!sig || !webhookSecret) {
      throw new Error("Webhook secret or signature missing")
    }

    // Construct and verify the Stripe event from the body, signature and secret
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: unknown) {
    // Narrow the unknown error to extract a safe message
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error(`Webhook Error: ${message}`)
    // Return an error if the event could not be verified
    return new Response(`Webhook Error: ${message}`, { status: 400 })
  }

  // Check whether the event type is one we need to handle
  if (relevantEvents.has(event.type)) {
    try {
      // Dispatch to the appropriate handler based on the event type
      switch (event.type) {
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          // Handle subscription status changes
          await handleSubscriptionChange(event)
          break

        case "checkout.session.completed":
          // Handle a completed checkout session (subscription)
          await handleCheckoutSession(event)
          break

        default:
          // Relevant event without a handler: throw an error
          throw new Error("Unhandled relevant event!")
      }
    } catch (error) {
      console.error("Webhook handler failed:", error)
      // Return an error if something went wrong while handling the event
      return new Response(
        "Webhook handler failed. View your nextjs function logs.",
        {
          status: 400,
        }
      )
    }
  }

  // Return a success response once the event is received and handled (or needs no handling)
  return new Response(JSON.stringify({ received: true }))
}
