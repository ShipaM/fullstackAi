import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const chatsTable = pgTable("chats", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export type InsertChat = typeof chatsTable.$inferInsert
export type SelectChat = typeof chatsTable.$inferSelect
