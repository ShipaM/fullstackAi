import {
  updateProfileByStripeCustomerId,
  updateProfileByUserId,
} from "@/db/queries/profiles-queries"
import { SelectProfile } from "@/db/schema"
import { stripe } from "@/lib/stripe"
import Stripe from "stripe"

type MembershipStatus = SelectProfile["membership"]

/**
 * Функция, определяющая статус членства пользователя на основе статуса подписки.
 * Если подписка активна или находится на пробном периоде, возвращается текущий статус членства.
 * Если подписка отменена или имеет любой проблемный статус (неполная, просроченная и т.д.),
 * статус членства переводится на "free".
 */
const getMembershipStatus = (
  status: Stripe.Subscription.Status,
  membership: MembershipStatus
): MembershipStatus => {
  switch (status) {
    case "active":
    case "trialing":
      // Если подписка активна или идет пробный период, оставляем текущий статус членства.
      return membership
    case "canceled":
    case "incomplete":
    case "incomplete_expired":
    case "past_due":
    case "paused":
    case "unpaid":
      // Если подписка отменена или возникает проблема с оплатой, статус членства "free".
      return "free"
    default:
      // На случай неизвестного статуса — по умолчанию "free".
      return "free"
  }
}

/**
 * Получение информации о подписке из Stripe по ее ID.
 * Расширение ответа для получения информации о способе оплаты по умолчанию.
 */
const getSubscription = async (subscriptionId: string) => {
  return stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method"],
  })
}

/**
 * Обновление информации о пользователе на основе данных из Stripe.
 * Здесь обновляются записи в профиле пользователя, включая ID клиента и ID подписки Stripe.
 */
export const updateStripeCustomer = async (
  userId: string,
  subscriptionId: string,
  customerId: string
) => {
  try {
    // Проверяем, переданы ли все необходимые параметры.
    if (!userId || !subscriptionId || !customerId) {
      throw new Error("Missing required parameters for updateStripeCustomer")
    }

    // Получаем информацию о подписке из Stripe.
    const subscription = await getSubscription(subscriptionId)

    // Обновляем профиль пользователя, записывая идентификаторы Stripe-клиента и подписки.
    const updatedProfile = await updateProfileByUserId(userId, {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
    })

    if (!updatedProfile) {
      throw new Error("Failed to update customer profile")
    }

    // Возвращаем обновленную запись профиля.
    return updatedProfile
  } catch (error) {
    console.error("Error in updateStripeCustomer:", error)
    throw error instanceof Error
      ? error
      : new Error("Failed to update Stripe customer")
  }
}

/**
 * Обработка изменения статуса подписки.
 * Получаем информацию о подписке и продукте из Stripe, определяем членство (продукт должен содержать
 * соответствующий метаданные membership: "free" или "pro").
 * На основе статуса подписки изменяем статус членства профиля в базе данных.
 */
export const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  productId: string
): Promise<MembershipStatus> => {
  try {
    // Проверяем наличие всех необходимых параметров.
    if (!subscriptionId || !customerId || !productId) {
      throw new Error(
        "Missing required parameters for manageSubscriptionStatusChange"
      )
    }

    // Получаем подписку.
    const subscription = await getSubscription(subscriptionId)

    // Получаем продукт по его ID для определения типа членства из метаданных.
    const product = await stripe.products.retrieve(productId)
    const membership = product.metadata.membership as MembershipStatus

    // Проверяем корректность полученного типа членства.
    if (!["free", "pro"].includes(membership)) {
      throw new Error(
        `Invalid membership type in product metadata: ${membership}`
      )
    }

    // Определяем статус членства на основе статуса подписки.
    const membershipStatus = getMembershipStatus(
      subscription.status,
      membership
    )

    // Обновляем профиль пользователя, присваивая ему новый статус членства в соответствии с подпиской.
    await updateProfileByStripeCustomerId(customerId, {
      stripeSubscriptionId: subscription.id,
      membership: membershipStatus,
    })

    // Возвращаем финальный статус членства.
    return membershipStatus
  } catch (error) {
    console.error("Error in manageSubscriptionStatusChange:", error)
    throw error instanceof Error
      ? error
      : new Error("Failed to update subscription status")
  }
}
