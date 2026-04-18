"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useUser } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { useState } from "react"

interface PlanPrice {
  monthly: string
  annually: string
}

interface Plan {
  name: string
  price: PlanPrice
  description: string
  features: string[]
  cta: string
  popular: boolean
}

const plans: Plan[] = [
  {
    name: "Free",
    price: { monthly: "$0", annually: "$0" },
    description: "Perfect for getting started",
    features: [
      "Up to 3 projects",
      "Basic analytics",
      "48-hour support response time",
      "1GB storage",
      "Community access",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: { monthly: "$20", annually: "$120" },
    description: "For growing teams and businesses",
    features: [
      "Unlimited projects",
      "Advanced analytics",
      "4-hour support response time",
      "100GB storage",
      "Priority support",
      "Custom integrations",
      "Team collaboration tools",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: { monthly: "Custom", annually: "Custom" },
    description: "For large-scale organizations",
    features: [
      "Everything in Pro",
      "Unlimited storage",
      "1-hour support response time",
      "24/7 phone support",
      "Custom contract",
      "Dedicated account manager",
      "Custom security features",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false)
  const { user } = useUser()

  const handleProSubscription = () => {
    const baseUrl = isAnnual
      ? process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_YEARLY
      : process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY

    if (!baseUrl) {
      console.error("Stripe payment link not configured")
      return
    }

    // Append client_reference_id to the URL
    const paymentUrl = `${baseUrl}?client_reference_id=${user?.id}`
    window.location.href = paymentUrl
  }

  return (
    <section id="pricing" className="relative overflow-hidden bg-zinc-50 py-24">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-232 flex-col items-center space-y-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl leading-[1.1] font-bold tracking-tight md:text-6xl"
          >
            Simple, transparent pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-[85%] text-lg leading-normal text-muted-foreground md:text-xl"
          >
            Choose the perfect plan for your needs
          </motion.p>

          <div className="flex flex-col items-center gap-6 pt-4">
            <div className="flex items-center gap-8">
              <button
                onClick={() => setIsAnnual(false)}
                className={`cursor-pointer text-sm font-medium transition-colors ${
                  !isAnnual ? "text-black" : "text-zinc-400 hover:text-zinc-500"
                }`}
              >
                Monthly billing
              </button>
              <div className="relative">
                <div className="h-6 w-10">
                  <div
                    className={`absolute inset-y-0 left-0 h-6 w-10 rounded-full transition-colors duration-200 ease-in-out ${
                      isAnnual ? "bg-black" : "bg-zinc-200"
                    }`}
                  />
                  <div
                    className={`absolute left-0 inline-block h-6 w-6 transform rounded-full border border-zinc-200 bg-white shadow-lg transition-transform duration-200 ease-in-out ${
                      isAnnual ? "translate-x-4" : "translate-x-0"
                    }`}
                    onClick={() => setIsAnnual(!isAnnual)}
                  />
                </div>
              </div>
              <button
                onClick={() => setIsAnnual(true)}
                className={`cursor-pointer text-sm font-medium transition-colors ${
                  isAnnual ? "text-black" : "text-zinc-400 hover:text-zinc-500"
                }`}
              >
                Annual billing
              </button>
            </div>
            {isAnnual && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600"
              >
                Save 17% with annual billing
              </motion.div>
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3"
        >
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col overflow-hidden rounded-3xl border border-zinc-200 p-8 transition-all duration-300 hover:border-zinc-300 ${
                plan.popular ? "border-2 border-black shadow-lg" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute top-7 -right-20 z-10 rotate-45 bg-black px-24 py-1 text-center text-sm font-medium text-white shadow-sm">
                  Popular
                </div>
              )}
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold">{plan.name}</h3>
                <p className="text-base text-muted-foreground">
                  {plan.description}
                </p>
                <div className="pt-4">
                  <span className="text-5xl font-bold tracking-tight">
                    {isAnnual ? plan.price.annually : plan.price.monthly}
                  </span>
                  {plan.name !== "Enterprise" && (
                    <span className="ml-1 text-base font-normal text-muted-foreground">
                      /{isAnnual ? "year" : "month"}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-4 pt-8">
                <ul className="flex flex-1 flex-col gap-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm"
                    >
                      <Check className="h-5 w-5 shrink-0 text-emerald-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full cursor-pointer ${
                    plan.popular
                      ? "bg-black text-white hover:bg-black/90"
                      : "bg-white hover:bg-zinc-50"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  onClick={
                    plan.name === "Pro" ? handleProSubscription : undefined
                  }
                >
                  {plan.cta}
                </Button>
              </div>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
