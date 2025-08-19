import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { profiles } from "../db/tables/profiles";
import { z } from "zod";
import { CreateProfileSchema } from "../routes/profile.schema";

export const getProfileById = async (id: string) => {
  const profile = await db.select().from(profiles).where(eq(profiles.id, id)).limit(1);
  return profile[0] || null;
};

export const createProfile = async (profileData: z.infer<typeof CreateProfileSchema> , user_id: string) => {
  try {
    const profile = await db.insert(profiles).values({...profileData, user_id}).returning();
    return profile[0] || null;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create profile");
  }
};
