"use client"

import { Button } from "@/components/ui/button"
import { motion, useScroll } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Header() {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    const heroHeight = window.innerHeight - 64

    const onScroll = () => {
      if (scrollY.get() > heroHeight) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    const unsubscribe = scrollY.on("change", onScroll)
    return () => unsubscribe()
  }, [scrollY])

  if (!isVisible) return null

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 z-50 w-full border-b border-zinc-200/50 bg-white/60 backdrop-blur-xl supports-backdrop-filter:bg-white/30"
    >
      <div className="mx-auto flex h-12 max-w-3xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium tracking-tight text-black/80 hover:text-black"
          >
            AI
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {["Features", "Pricing", "FAQ"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-[13px] font-medium text-black/60 transition-colors hover:text-black"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-[13px] font-medium text-black/60 hover:bg-zinc-100/50 hover:text-black"
          >
            Sign in
          </Button>
          <Button
            size="sm"
            className="rounded-full bg-black px-4 text-[13px] font-medium text-white hover:bg-black/90"
          >
            Get Started
          </Button>
        </div>
      </div>
    </motion.header>
  )
}
