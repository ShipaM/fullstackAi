"use client"

import { motion } from "framer-motion"
import Link from "next/link"

const footerLinks = [
  {
    title: "Product",
    links: [
      { name: "Product", href: "#" },
      { name: "Research", href: "#" },
      { name: "Company", href: "#" },
      { name: "News", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Terms of Service", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Responsible Disclosure", href: "#" },
      { name: "Compliance", href: "#" },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-black text-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="grid gap-4 py-6 md:grid-cols-3 md:py-8">
          {/* Logo and Copyright */}
          <div className="flex flex-col gap-2">
            <Link href="/" className="text-lg font-semibold">
              AI
            </Link>
            <p className="text-xs text-zinc-400">
              © {new Date().getFullYear()} AI Inc.
              <br />
              All rights reserved.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-4 md:col-span-2">
            {footerLinks.map((group) => (
              <div key={group.title} className="flex flex-col gap-2">
                <h3 className="text-xs font-semibold text-zinc-400">
                  {group.title}
                </h3>
                <ul className="flex flex-col gap-1.5">
                  {group.links.map((link) => (
                    <motion.li
                      key={link.name}
                      whileHover={{ x: 2 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <Link
                        href={link.href}
                        className="text-xs text-zinc-400 transition-colors hover:text-white"
                      >
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col justify-between gap-2 border-t border-zinc-800 py-4 text-xs text-zinc-400 md:flex-row">
          <div className="flex flex-wrap gap-2">
            <span>This site is protected by reCAPTCHA Enterprise.</span>
            <div className="flex flex-wrap gap-1">
              <span>The Google</span>
              <Link
                href="#"
                className="underline transition-colors hover:text-white"
              >
                Privacy Policy
              </Link>
              <span>and</span>
              <Link
                href="#"
                className="underline transition-colors hover:text-white"
              >
                Terms of Service
              </Link>
              <span>apply.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
