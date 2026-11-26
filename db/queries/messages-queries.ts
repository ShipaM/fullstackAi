import { asc, eq } from "drizzle-orm"
import { db } from "../db"
import { InsertMessage, messagesTable } from "../schema"

export const createMessage = async (data: InsertMessage) => {
  try {
    const [newMessage] = await db
      .insert(messagesTable)
      .values(data)
      .returning()

    return newMessage
  } catch (error) {
    console.error("Error creating message", error)

    throw new Error("Failed to create message")
  }
}

export const getMessagesByChatId = async (chatId: string) => {
  try {
    // Oldest first, so the conversation reads top to bottom
    const messages = await db.query.messages.findMany({
      where: eq(messagesTable.chatId, chatId),
      orderBy: asc(messagesTable.createdAt),
    })

    return messages
  } catch (error) {
    console.error("Error getting messages", error)

    throw new Error("Failed to get messages")
  }
}
