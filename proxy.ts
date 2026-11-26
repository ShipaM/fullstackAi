import { clerkMiddleware } from "@clerk/nextjs/server"

// Auth checks live in each protected page / layout / route handler / server action
// via `await auth.protect()`. clerkMiddleware() is still required for Clerk to work.
export default clerkMiddleware()

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
