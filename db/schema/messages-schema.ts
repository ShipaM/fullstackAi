import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { chatsTable } from "./chats-schema"

export const roleEnum = pgEnum("role", ["user", "assistant"])

export const messagesTable = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  // Deleting a chat removes all of its messages
  chatId: uuid("chat_id")
    .references(() => chatsTable.id, { onDelete: "cascade" })
    .notNull(),
  content: text("content").notNull(),
  role: roleEnum("role").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export type InsertMessage = typeof messagesTable.$inferInsert
export type SelectMessage = typeof messagesTable.$inferSelect
