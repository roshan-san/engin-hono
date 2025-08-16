import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { profiles } from "../db/schema";
import { UpdateProfileSchema } from "../routes/profile.schema";
import { z } from "zod";

export const getProfileById = async (id: string) => {
  const profile = await db.select().from(profiles).where(eq(profiles.id, id)).limit(1);
  return profile[0] || null;
};

export const getProfileByUserId = async (userId: string) => {
  const profile = await db.select().from(profiles).where(eq(profiles.user_id, userId)).limit(1);
  return profile[0] || null;
};

export const createProfile = async (profileData: {
  user_id: string;
  username: string;
  full_name: string;
  email: string;
  user_type: 'creator' | 'investor' | 'mentor';
  preferred_work_type: 'full-time' | 'part-time' | 'contract' | 'internship';
  preferred_domain: 'creator' | 'investor' | 'mentor';
  experience_level: 'junior' | 'mid_level' | 'senior' | 'expert';
  city?: string;
  state?: string;
  country?: string;
  bio?: string;
}) => {
  const [profile] = await db.insert(profiles).values(profileData).returning();
  return profile;
};

export const updateProfile = async (id: string, updateData: z.infer<typeof UpdateProfileSchema>) => {
  const [profile] = await db
    .update(profiles)
    .set({
      ...updateData,
      updated_at: new Date(),
    })
    .where(eq(profiles.id, id))
    .returning();
  
  return profile;
};

export const updateProfileByUserId = async (userId: string, updateData: z.infer<typeof UpdateProfileSchema>) => {
  const [profile] = await db
    .update(profiles)
    .set({
      ...updateData,
      updated_at: new Date(),
    })
    .where(eq(profiles.user_id, userId))
    .returning();
  
  return profile;
};