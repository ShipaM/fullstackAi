import {
  updateProfileByStripeCustomerId,
  updateProfileByUserId,
} from "@/db/queries/profiles-queries"
import { SelectProfile } from "@/db/schema"
import { stripe } from "@/lib/stripe"
import Stripe from "stripe"

type MembershipStatus = SelectProfile["membership"]

/**
 * Determines the user's membership status based on the subscription status.
 * If the subscription is active or trialing, the current membership status is returned.
 * If the subscription is canceled or in any problematic state (incomplete, past due, etc.),
 * the membership status is set to "free".
 */
const getMembershipStatus = (
  status: Stripe.Subscription.Status,
  membership: MembershipStatus
): MembershipStatus => {
  switch (status) {
    case "active":
    case "trialing":
      // Subscription is active or trialing: keep the current membership status.
      return membership
    case "canceled":
    case "incomplete":
    case "incomplete_expired":
    case "past_due":
    case "paused":
    case "unpaid":
      // Subscription is canceled or has a payment problem: membership becomes "free".
      return "free"
    default:
      // Unknown status: default to "free".
      return "free"
  }
}

/**
 * Retrieves a subscription from Stripe by its ID.
 * Expands the response to include the default payment method.
 */
const getSubscription = async (subscriptionId: string) => {
  return stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method"],
  })
}

/**
 * Updates the user's profile with data from Stripe.
 * Stores the Stripe customer ID and subscription ID on the user's profile.
 */
export const updateStripeCustomer = async (
  userId: string,
  subscriptionId: string,
  customerId: string
) => {
  try {
    // Ensure all required parameters are provided.
    if (!userId || !subscriptionId || !customerId) {
      throw new Error("Missing required parameters for updateStripeCustomer")
    }

    // Fetch the subscription from Stripe.
    const subscription = await getSubscription(subscriptionId)

    // Update the user's profile with the Stripe customer and subscription IDs.
    const updatedProfile = await updateProfileByUserId(userId, {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
    })

    if (!updatedProfile) {
      throw new Error("Failed to update customer profile")
    }

    // Return the updated profile record.
    return updatedProfile
  } catch (error) {
    console.error("Error in updateStripeCustomer:", error)
    throw error instanceof Error
      ? error
      : new Error("Failed to update Stripe customer")
  }
}

/**
 * Handles a subscription status change.
 * Fetches the subscription and product from Stripe and determines the membership
 * (the product must have a "membership" metadata value of "free" or "pro").
 * Updates the profile's membership status in the database based on the subscription status.
 */
export const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  productId: string
): Promise<MembershipStatus> => {
  try {
    // Ensure all required parameters are provided.
    if (!subscriptionId || !customerId || !productId) {
      throw new Error(
        "Missing required parameters for manageSubscriptionStatusChange"
      )
    }

    // Fetch the subscription.
    const subscription = await getSubscription(subscriptionId)

    // Fetch the product by ID to read the membership type from its metadata.
    const product = await stripe.products.retrieve(productId)
    const membership = product.metadata.membership as MembershipStatus

    // Validate the membership type.
    if (!["free", "pro"].includes(membership)) {
      throw new Error(
        `Invalid membership type in product metadata: ${membership}`
      )
    }

    // Determine the membership status from the subscription status.
    const membershipStatus = getMembershipStatus(
      subscription.status,
      membership
    )

    // Update the user's profile with the new membership status.
    await updateProfileByStripeCustomerId(customerId, {
      stripeSubscriptionId: subscription.id,
      membership: membershipStatus,
    })

    // Return the resulting membership status.
    return membershipStatus
  } catch (error) {
    console.error("Error in manageSubscriptionStatusChange:", error)
    throw error instanceof Error
      ? error
      : new Error("Failed to update subscription status")
  }
}
