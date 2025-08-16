import {
  pgTable,
  timestamp,
  uuid,
  text,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { user } from '../schema';

// Enums for profile fields
export const userTypeEnum = pgEnum('user_type', [
  'creator',
  'investor', 
  'mentor',
]);

export const onboardingStatusEnum = pgEnum('onboarding_status', [
  'incomplete',
  'complete',
]);

export const experienceLevelEnum = pgEnum('experience_level', [
  'junior',         // 0-2 years
  'mid_level',      // 3-5 years  
  'senior',         // 6-10 years
  'expert'          // 10+ years
]);

export const preferredWorkTypeEnum = pgEnum('preferred_work_type', [
  'full-time',
  'part-time',
  'contract',
  'internship',
]);

export const profiles = pgTable('profiles', {
  id: uuid().primaryKey().defaultRandom(),
  user_id: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  username: text().notNull(),
  full_name: text().notNull(),
  email: text().notNull(),
  user_type: userTypeEnum('user_type').notNull(),
  
  // Location fields
  city: text(),
  state: text(),
  country: text(),
  
  // Work preferences & availability
  preferred_work_type: preferredWorkTypeEnum('preferred_work_type').notNull(), // What they prefer (full-time, contract, etc.)
  preferred_domain: userTypeEnum('preferred_domain').notNull(), // What role/domain they prefer to work in
  experience_level: experienceLevelEnum('experience_level').notNull(),
  
  
  bio: text(),

  // Onboarding tracking
  onboarding_status: text().notNull().default('incomplete'), // 'incomplete', 'complete' enum 
  onboarding_step: text().notNull().default('profile'), // 'profile', 'preferences', 'verification', 'complete'

  created_at: timestamp({ withTimezone: true }).defaultNow(),
  updated_at: timestamp({ withTimezone: true }).defaultNow(),
});
