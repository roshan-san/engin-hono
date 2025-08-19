import { z } from 'zod';
import { userTypeValues, preferredWorkTypeValues, experienceLevelValues } from '../db/enums';

export const CreateProfileSchema = z.object({
  username: z.string().min(3),
  full_name: z.string().min(3),
  email: z.string(),
  user_type: z.enum(userTypeValues),
  preferred_work_type: z.enum(preferredWorkTypeValues),
  preferred_domain: z.enum(userTypeValues),
  experience_level: z.enum(experienceLevelValues),
})