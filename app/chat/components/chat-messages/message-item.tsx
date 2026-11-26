import { SelectMessage } from "@/db/schema"
import { cn } from "@/lib/utils"

// Messages created on the client don't have DB timestamps yet
export type ChatMessage = Pick<SelectMessage, "id" | "role" | "content">

interface MessageItemProps {
  message: ChatMessage
}

export default function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2 whitespace-pre-wrap",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        {message.content}
      </div>
    </div>
  )
}
