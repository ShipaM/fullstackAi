import Stripe from "stripe"
// Импортируем класс Stripe из пакета "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Создаём экземпляр клиента Stripe, используя секретный ключ из переменных окружения
  apiVersion: "2026-03-25.dahlia",
  // Указываем версию API Stripe, чтобы быть уверенными, что функциональность соответствует ожидаемой версии API
  appInfo: {
    name: "Todo App",
    // Указываем имя приложения, которое использует Stripe
    version: "0.1.0",
    // Указываем текущую версию приложения
  },
})
