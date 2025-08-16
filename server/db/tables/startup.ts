import {
  pgTable,
  timestamp,
  uuid,
  text,
  boolean,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { user } from '../schema';

// Enums for startup fields based on industry standards
export const startupIndustryEnum = pgEnum('startup_industry', [
  'technology',
  'healthcare',
  'fintech',
  'edutech',
  'greentech',
  'agritech',
  'ecommerce',
  'saas',
  'blockchain',
  'iot',
  'artificial_intelligence',
  'foodtech',
  'spacetech',
  'biotech',
  'cleantech',
  'retailtech',
  'cybersecurity',
  'real_estate',
  'transportation',
  'media_entertainment',
  'other'
]);

export const startupStageEnum = pgEnum('startup_stage', [
  'pre_seed',
  'seed',
  'series_a',
  'series_b',
  'series_c',
  'series_d',
  'ipo',
  'other'
]);

export const startup = pgTable('startup', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  tagline: text(), // Short, catchy description (like Twitter bio)
  description: text(), // Full description (expandable)
  founder_id: text('founder_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  industry: startupIndustryEnum('industry'),
  stage: startupStageEnum('stage'),
  // Location fields
  city: text(),
  state: text(),
  country: text(),
  website: text(),
  // Social proof
  team_size: text(), // "1-10", "11-50", "51-200", "200+"
  founded_year: text(), // Year the startup was founded
  // Status
  is_active: boolean('is_active').default(true),
  created_at: timestamp({ withTimezone: true }).defaultNow(),
  updated_at: timestamp({ withTimezone: true }).defaultNow(),
});
