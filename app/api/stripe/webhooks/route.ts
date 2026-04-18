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

// Функция для обработки изменений в статусе подписки.
// Извлекает из события объект подписки, получает productId из первой позиции массива items,
// затем вызывает функцию manageSubscriptionStatusChange для обновления статуса подписки на основании полученных данных.
async function handleSubscriptionChange(event: Stripe.Event) {
  // Извлечение объекта подписки из события Stripe
  const subscription = event.data.object as Stripe.Subscription
  // Получение идентификатора продукта, связанного с подпиской
  const productId = subscription.items.data[0].price.product as string
  // Обновление статуса подписки (логика в manageSubscriptionStatusChange)
  await manageSubscriptionStatusChange(
    subscription.id,
    subscription.customer as string,
    productId
  )
}

// Функция для обработки события "checkout.session.completed".
// Она актуальна для сессий оформления, где mode = "subscription".
// После успешной оплаты сохраняет данные о клиенте (обновляет данные Stripe клиента),
// затем получает расширенную информацию о подписке и вызывает manageSubscriptionStatusChange.
async function handleCheckoutSession(event: Stripe.Event) {
  // Извлечение объекта сессии из события Stripe
  const checkoutSession = event.data.object as Stripe.Checkout.Session
  // Проверяем, что режим сессии - подписка
  if (checkoutSession.mode === "subscription") {
    // Идентификатор подписки, закреплённой за сессией
    const subscriptionId = checkoutSession.subscription as string

    // Обновляем данные клиента Stripe (например, привязываем клиента к подписке в нашей системе)
    await updateStripeCustomer(
      checkoutSession.client_reference_id as string,
      subscriptionId,
      checkoutSession.customer as string
    )

    // Получаем данные о подписке, включая метод оплаты по умолчанию
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["default_payment_method"],
    })

    // Получаем идентификатор продукта, связанный с подпиской
    const productId = subscription.items.data[0].price.product as string

    // Обновляем статус подписки в нашей системе
    await manageSubscriptionStatusChange(
      subscription.id,
      subscription.customer as string,
      productId
    )
  }
}

export async function POST(req: Request) {
  // Читаем тело запроса как текст
  const body = await req.text()
  // Получаем подпись Stripe из заголовков
  const sig = (await headers()).get("Stripe-Signature") as string
  // Секретный ключ вебхука
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  let event: Stripe.Event

  try {
    // Проверяем, что сигнатура и секрет доступны
    if (!sig || !webhookSecret) {
      throw new Error("Webhook secret or signature missing")
    }

    // Пытаемся конструктивно воссоздать событие Stripe на основе тела запроса, подписи и секрета
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    // Возвращаем ошибку, если не удалось подтвердить событие
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  // Проверяем, относится ли тип события к релевантным (которые нужно обработать)
  if (relevantEvents.has(event.type)) {
    try {
      // В зависимости от типа события вызываем соответствующий обработчик
      switch (event.type) {
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          // Обрабатываем изменения статуса подписки
          await handleSubscriptionChange(event)
          break

        case "checkout.session.completed":
          // Обрабатываем завершённую сессию оформления (подписка)
          await handleCheckoutSession(event)
          break

        default:
          // Если событие релевантно, но не предусмотрен обработчик – выбрасываем ошибку
          throw new Error("Unhandled relevant event!")
      }
    } catch (error) {
      console.error("Webhook handler failed:", error)
      // Возвращаем ошибку, если что-то пошло не так при обработке события
      return new Response(
        "Webhook handler failed. View your nextjs function logs.",
        {
          status: 400,
        }
      )
    }
  }

  // Возвращаем успешный ответ, если событие принято и обработано (или не требует обработки)
  return new Response(JSON.stringify({ received: true }))
}
