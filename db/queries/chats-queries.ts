import { desc, eq } from "drizzle-orm"
import { db } from "../db"
import { chatsTable, InsertChat } from "../schema"

export const createChat = async (data: InsertChat) => {
  try {
    const [newChat] = await db.insert(chatsTable).values(data).returning()

    return newChat
  } catch (error) {
    console.error("Error creating chat", error)

    throw new Error("Failed to create chat")
  }
}

export const getChatById = async (id: string) => {
  try {
    const chat = await db.query.chats.findFirst({
      where: eq(chatsTable.id, id),
    })

    return chat
  } catch (error) {
    console.error("Error getting chat", error)

    throw new Error("Failed to get chat")
  }
}

export const getChatsByUserId = async (userId: string) => {
  try {
    // Most recently updated chats first
    const chats = await db.query.chats.findMany({
      where: eq(chatsTable.userId, userId),
      orderBy: desc(chatsTable.updatedAt),
    })

    return chats
  } catch (error) {
    console.error("Error getting chats", error)

    throw new Error("Failed to get chats")
  }
}

export const updateChat = async (id: string, data: Partial<InsertChat>) => {
  try {
    const [updatedChat] = await db
      .update(chatsTable)
      .set(data)
      .where(eq(chatsTable.id, id))
      .returning()

    return updatedChat
  } catch (error) {
    console.error("Error updating chat", error)

    throw new Error("Failed to update chat")
  }
}

export const deleteChat = async (id: string) => {
  try {
    await db.delete(chatsTable).where(eq(chatsTable.id, id))
  } catch (error) {
    console.error("Error deleting chat", error)

    throw new Error("Failed to delete chat")
  }
}
