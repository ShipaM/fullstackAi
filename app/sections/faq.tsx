"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { motion } from "framer-motion"

const faqs = [
  {
    question: "What makes your platform different?",
    answer:
      "Our platform combines cutting-edge AI technology with an intuitive interface, offering unmatched automation capabilities while maintaining the highest standards of data privacy and security.",
  },
  {
    question: "How does the free trial work?",
    answer:
      "Start with a 14-day free trial of our Pro plan - no credit card required. You'll get full access to all Pro features, and can upgrade, downgrade, or cancel at any time.",
  },
  {
    question: "What happens to my data?",
    answer:
      "Your data is encrypted end-to-end and stored in secure, SOC 2 compliant data centers. We never share or sell your information, and you maintain full ownership of your data.",
  },
  {
    question: "Can I change plans later?",
    answer:
      "Yes, you can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately, and we'll prorate any payments automatically.",
  },
  {
    question: "Do you offer custom enterprise solutions?",
    answer:
      "Yes, our Enterprise plan offers customized solutions, including dedicated support, custom integrations, and tailored security features. Contact our sales team to learn more.",
  },
  {
    question: "What kind of support do you offer?",
    answer:
      "We provide tiered support based on your plan - from community support for Free users to 24/7 priority support for Enterprise customers, including phone support and a dedicated account manager.",
  },
  {
    question: "What integrations are available?",
    answer:
      "We integrate with major productivity tools including Slack, Microsoft Teams, Google Workspace, and more. Pro and Enterprise plans support custom integrations.",
  },
]

export default function FAQ() {
  return (
    <section id="faq" className="relative overflow-hidden bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-232 flex-col items-center space-y-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl leading-[1.1] font-bold tracking-tight md:text-6xl"
          >
            Frequently asked questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-[85%] text-lg leading-normal text-muted-foreground md:text-xl"
          >
            Everything you need to know about our platform
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-16 max-w-3xl"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-zinc-200 py-2 last:border-0"
              >
                <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
