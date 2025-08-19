// Extract enum values from Drizzle schema for use in Zod schemas
import { 
  userTypeEnum, 
  experienceLevelEnum, 
  preferredWorkTypeEnum,
  onboardingStatusEnum 
} from './tables/profiles';

// Extract the enum values for Zod schemas
export const userTypeValues = userTypeEnum.enumValues;
export const experienceLevelValues = experienceLevelEnum.enumValues;
export const preferredWorkTypeValues = preferredWorkTypeEnum.enumValues;
export const onboardingStatusValues = onboardingStatusEnum.enumValues;
