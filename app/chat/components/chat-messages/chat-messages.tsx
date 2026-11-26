"use client"

import { generateOpenAIResponseAction } from "@/actions/openai-actions"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SelectMessage } from "@/db/schema"
import { readStreamableValue } from "@ai-sdk/rsc"
import { useState } from "react"
import MessageInput from "./message-input"
import MessageItem, { ChatMessage } from "./message-item"

interface ChatMessagesProps {
  messages: SelectMessage[]
}

export default function ChatMessages({
  messages: initialMessages,
}: ChatMessagesProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [isStreaming, setIsStreaming] = useState(false)

  // Replaces the content of the assistant message with the given id
  const setAssistantContent = (id: string, content: string) =>
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, content } : m))
    )

  const handleSend = async (content: string) => {
    const assistantId = crypto.randomUUID()

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content },
      { id: assistantId, role: "assistant", content: "" },
    ])
    setIsStreaming(true)

    try {
      const result = await generateOpenAIResponseAction(content)
      if (!result.isSuccess || !result.data) throw new Error(result.message)

      // Each streamed value is a new text chunk, so accumulate them
      let text = ""
      for await (const chunk of readStreamableValue(result.data)) {
        text += chunk ?? ""
        setAssistantContent(assistantId, text)
      }
    } catch (error) {
      console.error("Error streaming response:", error)
      setAssistantContent(assistantId, "Something went wrong. Please try again.")
    } finally {
      setIsStreaming(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="min-h-0 flex-1">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 p-4">
          {messages.length === 0 ? (
            <p className="mt-20 text-center text-muted-foreground">
              How can I help you today?
            </p>
          ) : (
            messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))
          )}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <MessageInput onSend={handleSend} disabled={isStreaming} />
      </div>
    </div>
  )
}
