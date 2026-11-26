import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function NewChatButton() {
  return (
    <Button variant="outline" className="w-full justify-start gap-2">
      <Plus className="size-4" />
      New chat
    </Button>
  )
}
