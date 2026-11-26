"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SendHorizontal } from "lucide-react"
import { useState } from "react"

interface MessageInputProps {
  onSend: (content: string) => void
  disabled?: boolean
}

export default function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [input, setInput] = useState("")

  const submit = () => {
    const content = input.trim()
    if (!content || disabled) return

    onSend(content)
    setInput("")
  }

  return (
    <form
      className="mx-auto flex max-w-3xl items-end gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          // Enter sends the message, Shift+Enter inserts a new line
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            submit()
          }
        }}
        placeholder="Send a message..."
        className="max-h-40 min-h-11 resize-none"
        rows={1}
      />
      <Button type="submit" size="icon" disabled={!input.trim() || disabled}>
        <SendHorizontal className="size-4" />
      </Button>
    </form>
  )
}
