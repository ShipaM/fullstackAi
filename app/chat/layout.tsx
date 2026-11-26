import { getChatsAction } from "@/actions/db/chats-actions"
import { auth } from "@clerk/nextjs/server"
import ChatHistory from "./components/chat-history/chat-history"

export default async function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  await auth.protect()

  const { data: chats = [] } = await getChatsAction()

  return (
    <div className="flex h-dvh">
      <aside className="w-1/5 border-r">
        <ChatHistory chats={chats} />
      </aside>
      <section className="flex w-4/5 flex-col">{children}</section>
    </div>
  )
}
