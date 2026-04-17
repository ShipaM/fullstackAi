"use client"

import { Card } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { SignUp, useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"

const carouselItems = [
  {
    title: "Feature 1",
    color: "bg-pink-500",
  },
  {
    title: "Feature 2",
    color: "bg-violet-500",
  },
  {
    title: "Feature 3",
    color: "bg-blue-500",
  },
  {
    title: "Feature 4",
    color: "bg-green-500",
  },
]

export default function Hero() {
  const [mounted, setMounted] = useState(false)
  const { user } = useUser()

  useEffect(() => {
    queueMicrotask(() => setMounted(true))
  }, [])

  if (!mounted) return null

  if (!user) {
    return (
      <section id="hero" className="grid h-screen grid-cols-1 md:grid-cols-2">
        {/* Left Column - Sign Up */}
        <div className="flex flex-col items-center justify-center px-4 md:px-12">
          <div className="mb-8 text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
              Transform your workflow with{" "}
              <span className="bg-linear-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
                intelligent automation
              </span>
            </h1>

            <p className="text-lg text-muted-foreground md:text-xl">
              Streamline your processes, boost productivity, and achieve more.
            </p>
          </div>

          <div className="w-full max-w-md">
            <SignUp
              forceRedirectUrl="/"
              routing="hash"
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-none",
                  formButtonPrimary: "bg-black hover:bg-zinc-800",
                  formFieldInput: "rounded-xl border-zinc-200",
                  formFieldLabel: "text-zinc-500",
                  headerTitle: "text-zinc-900",
                  headerSubtitle: "text-zinc-500",
                  socialButtonsBlockButton: "border-zinc-200 hover:bg-zinc-50",
                  socialButtonsBlockButtonText: "text-zinc-900",
                  dividerLine: "bg-zinc-200",
                  dividerText: "text-zinc-400",
                  footer: "text-zinc-400",
                  footerActionLink: "text-zinc-900 hover:text-zinc-800",
                },
              }}
            />
          </div>
        </div>

        {/* Right Column - Carousel */}
        <div className="hidden items-center justify-center bg-zinc-50 px-4 md:flex md:px-12">
          <Carousel className="w-full max-w-xl">
            <CarouselContent>
              {carouselItems.map((item, index) => (
                <CarouselItem key={index}>
                  <Card className="border-0 bg-transparent p-1 shadow-none">
                    <div className="flex aspect-square items-center justify-center p-6">
                      <div className="space-y-4">
                        <h3 className="text-xl font-medium">{item.title}</h3>
                        <div
                          className={`h-64 rounded-2xl ${item.color} shadow-lg`}
                        ></div>
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="border-zinc-200 bg-white/80 hover:bg-white" />
            <CarouselNext className="border-zinc-200 bg-white/80 hover:bg-white" />
          </Carousel>
        </div>
      </section>
    )
  }

  return null
}
