import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { profilesTable } from "./schema"
const schema = { profiles: profilesTable }

export const client = postgres(process.env.DATABASE_URL!)
export const db = drizzle(client, { schema })
