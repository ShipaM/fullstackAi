import { eq } from "drizzle-orm"
import { db } from "../db"
import { InsertProfile, profilesTable } from "../schema"

export const createProfile = async (data: InsertProfile) => {
  try {
    const [newProfile] = await db.insert(profilesTable).values(data).returning()
    return newProfile
  } catch (error) {
    console.error("Error creating profile", error)
    throw new Error("Failed to create profile")
  }
}

export const getProfileByUserId = async (userId: string) => {
  try {
    const profile = await db.query.profiles.findFirst({
      where: eq(profilesTable.userId, userId),
    })
    return profile
  } catch (error) {
    console.log("Error getting profile", error)
    throw new Error("Failed to get profile")
  }
}

export const updateProfileByUserId = async (
  userId: string,
  data: Partial<InsertProfile>
) => {
  try {
    const [updatedProfile] = await db
      .update(profilesTable)
      .set(data)
      .where(eq(profilesTable.userId, userId))
      .returning()
    return updatedProfile
  } catch (error) {
    console.log("Error updating profile", error)
    throw new Error("Failed to update profile")
  }
}

export const deleteProfile = async (userId: string) => {
  try {
    await db.delete(profilesTable).where(eq(profilesTable.userId, userId))
  } catch (error) {
    console.log("Error deleting profile", error)
    throw new Error("Failed to delete profile")
  }
}

export const updateProfileByStripeCustomerId = async (
  stripeCustomerId: string,
  data: Partial<InsertProfile>
) => {
  try {
    const [updatedProfile] = await db
      .update(profilesTable)
      .set(data)
      .where(eq(profilesTable.stripeCustomerId, stripeCustomerId))
      .returning()
    return updatedProfile
  } catch (error) {
    console.error("Error updating profile by stripe customer id", error)
    throw new Error("Failed to update profile by stripe customer id")
  }
}
