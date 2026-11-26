"use server"

import { getChatById } from "@/db/queries/chats-queries"
import {
  createMessage,
  getMessagesByChatId,
} from "@/db/queries/messages-queries"
import { InsertMessage, SelectMessage } from "@/db/schema"
import { ActionState } from "@/types"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

// Checks that the chat exists and belongs to the signed-in user
async function ownsChat(chatId: string) {
  const { userId } = await auth()
  if (!userId) return false

  const chat = await getChatById(chatId)
  return chat?.userId === userId
}

export async function createMessageAction(
  data: Pick<InsertMessage, "chatId" | "content" | "role">
): Promise<ActionState<SelectMessage>> {
  try {
    if (!(await ownsChat(data.chatId))) {
      return { isSuccess: false, message: "Chat not found" }
    }

    const newMessage = await createMessage(data)

    revalidatePath("/chat")

    return {
      isSuccess: true,
      message: "Message created successfully",
      data: newMessage,
    }
  } catch (error) {
    console.error("Error creating message", error)

    return { isSuccess: false, message: "Failed to create message" }
  }
}

export async function getMessagesByChatIdAction(
  chatId: string
): Promise<ActionState<SelectMessage[]>> {
  try {
    if (!(await ownsChat(chatId))) {
      return { isSuccess: false, message: "Chat not found" }
    }

    const messages = await getMessagesByChatId(chatId)

    return {
      isSuccess: true,
      message: "Messages fetched successfully",
      data: messages,
    }
  } catch (error) {
    console.error("Error getting messages", error)

    return { isSuccess: false, message: "Failed to get messages" }
  }
}
