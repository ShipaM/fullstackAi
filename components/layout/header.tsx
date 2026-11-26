"use client"

import ThemeToggle from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { SignOutButton, useUser } from "@clerk/nextjs"
import { motion, useScroll } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Header() {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollY } = useScroll()
  const { isLoaded, isSignedIn } = useUser()

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

  if (!isVisible) {
    return (
      <div className="fixed top-3 right-4 z-50">
        <ThemeToggle />
      </div>
    )
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/60 backdrop-blur-xl supports-backdrop-filter:bg-background/30"
    >
      <div className="mx-auto flex h-12 max-w-3xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium tracking-tight text-foreground/80 hover:text-foreground"
          >
            AI
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {["Features", "Pricing", "FAQ"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="cursor-pointer text-[13px] font-medium text-foreground/60 transition-colors hover:text-foreground"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {isLoaded && isSignedIn && (
            <SignOutButton redirectUrl="/">
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer text-[13px] font-medium text-foreground/60 hover:bg-accent/50 hover:text-foreground"
              >
                Logout
              </Button>
            </SignOutButton>
          )}
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  )
}
