import { auth } from "@clerk/nextjs/server"

export default async function ChatPage() {
  const { userId } = await auth.protect()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 p-4 text-center">
      <h1 className="text-2xl font-semibold">Chat</h1>
      <p className="text-muted-foreground">Coming soon. Signed in as {userId}</p>
    </div>
  )
}
