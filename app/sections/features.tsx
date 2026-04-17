"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { BarChart, Shield, Sparkles, Zap } from "lucide-react"

const features = [
  {
    title: "Lightning Fast",
    description:
      "Process tasks in milliseconds with our optimized engine. Experience speed that sets new standards.",
    icon: Zap,
    gradient:
      "from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20",
  },
  {
    title: "Enterprise Security",
    description:
      "Bank-grade encryption and security protocols that keep your data protected at all times.",
    icon: Shield,
    gradient:
      "from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20",
  },
  {
    title: "Advanced Analytics",
    description:
      "Gain deep insights with comprehensive reporting tools that help you make data-driven decisions.",
    icon: BarChart,
    gradient:
      "from-orange-500/10 to-yellow-500/10 hover:from-orange-500/20 hover:to-yellow-500/20",
  },
  {
    title: "Smart Automation",
    description:
      "AI-powered workflows that learn and adapt to your needs, making work effortless.",
    icon: Sparkles,
    gradient:
      "from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-zinc-50 py-24"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-232 flex-col items-center space-y-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl leading-[1.1] font-bold tracking-tight md:text-6xl"
          >
            Powerful Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-[85%] text-lg leading-normal text-muted-foreground md:text-xl"
          >
            Everything you need to streamline your workflow and boost
            productivity.
          </motion.p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto mt-16 grid max-w-6xl gap-8 md:grid-cols-2"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={item}>
              <Card
                className={`relative h-full overflow-hidden border-0 bg-linear-to-br ${feature.gradient} p-8 transition-all duration-300`}
              >
                <div className="space-y-4">
                  <feature.icon className="h-12 w-12 text-zinc-900" />
                  <h3 className="text-2xl font-semibold tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
