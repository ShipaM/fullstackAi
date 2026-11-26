import { SelectChat } from "@/db/schema"

interface ChatItemProps {
  chat: SelectChat
}

export default function ChatItem({ chat }: ChatItemProps) {
  return (
    <div className="truncate rounded-md px-3 py-2 text-sm hover:bg-muted">
      {chat.name}
    </div>
  )
}
