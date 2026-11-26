"use server"

import {
  createChat,
  deleteChat,
  getChatById,
  getChatsByUserId,
  updateChat,
} from "@/db/queries/chats-queries"
import { SelectChat } from "@/db/schema"
import { ActionState } from "@/types"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

// Returns the chat only if it belongs to the signed-in user
async function getOwnedChat(chatId: string) {
  const { userId } = await auth()
  if (!userId) return undefined

  const chat = await getChatById(chatId)
  return chat?.userId === userId ? chat : undefined
}

export async function createChatAction(
  name: string
): Promise<ActionState<SelectChat>> {
  try {
    const { userId } = await auth()
    if (!userId) return { isSuccess: false, message: "Unauthorized" }

    const newChat = await createChat({ userId, name })

    revalidatePath("/chat")

    return {
      isSuccess: true,
      message: "Chat created successfully",
      data: newChat,
    }
  } catch (error) {
    console.error("Error creating chat", error)

    return { isSuccess: false, message: "Failed to create chat" }
  }
}

export async function getChatsAction(): Promise<ActionState<SelectChat[]>> {
  try {
    const { userId } = await auth()
    if (!userId) return { isSuccess: false, message: "Unauthorized" }

    const chats = await getChatsByUserId(userId)

    return {
      isSuccess: true,
      message: "Chats fetched successfully",
      data: chats,
    }
  } catch (error) {
    console.error("Error getting chats", error)

    return { isSuccess: false, message: "Failed to get chats" }
  }
}

export async function getChatByIdAction(
  chatId: string
): Promise<ActionState<SelectChat>> {
  try {
    const chat = await getOwnedChat(chatId)
    if (!chat) return { isSuccess: false, message: "Chat not found" }

    return {
      isSuccess: true,
      message: "Chat fetched successfully",
      data: chat,
    }
  } catch (error) {
    console.error("Error getting chat", error)

    return { isSuccess: false, message: "Failed to get chat" }
  }
}

export async function renameChatAction(
  chatId: string,
  name: string
): Promise<ActionState<SelectChat>> {
  try {
    const chat = await getOwnedChat(chatId)
    if (!chat) return { isSuccess: false, message: "Chat not found" }

    const updatedChat = await updateChat(chatId, { name })

    revalidatePath("/chat")

    return {
      isSuccess: true,
      message: "Chat renamed successfully",
      data: updatedChat,
    }
  } catch (error) {
    console.error("Error renaming chat", error)

    return { isSuccess: false, message: "Failed to rename chat" }
  }
}

export async function deleteChatAction(
  chatId: string
): Promise<ActionState<void>> {
  try {
    const chat = await getOwnedChat(chatId)
    if (!chat) return { isSuccess: false, message: "Chat not found" }

    // Messages are removed by the ON DELETE CASCADE foreign key
    await deleteChat(chatId)

    revalidatePath("/chat")

    return { isSuccess: true, message: "Chat deleted successfully" }
  } catch (error) {
    console.error("Error deleting chat", error)

    return { isSuccess: false, message: "Failed to delete chat" }
  }
}
