import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { ClerkProvider } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import {
  createProfile,
  getProfileByUserId,
} from "@/db/queries/profiles-queries"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { userId } = await auth()

  if (userId) {
    const profile = await getProfileByUserId(userId)
    if (!profile) {
      await createProfile({ userId })
    }
  }
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={cn(
          "antialiased",
          fontMono.variable,
          "font-sans",
          geist.variable
        )}
      >
        <body>
          <ThemeProvider>
            <Header />
            <main className="flex min-h-screen flex-col">{children}</main>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
