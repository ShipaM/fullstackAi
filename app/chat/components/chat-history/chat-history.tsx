import { ScrollArea } from "@/components/ui/scroll-area"
import { SelectChat } from "@/db/schema"
import ChatItem from "./chat-item"
import NewChatButton from "./new-chat-button"

interface ChatHistoryProps {
  chats: SelectChat[]
}

export default function ChatHistory({ chats }: ChatHistoryProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-3">
        <NewChatButton />
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1 p-2">
          {chats.length === 0 ? (
            <p className="p-2 text-sm text-muted-foreground">No chats yet</p>
          ) : (
            chats.map((chat) => <ChatItem key={chat.id} chat={chat} />)
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
