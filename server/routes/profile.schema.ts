import { z } from '@hono/zod-openapi';

export const CreateProfileSchema = z.object({
  username: z.string().min(3).openapi({
    example: 'john_doe',
  }),
  full_name: z.string().min(3).openapi({
    example: 'John Doe',
  }),
  email: z.string().email().openapi({
    example: 'john.doe@example.com',
  }),
  user_type: z.enum(['creator', 'investor', 'mentor']).openapi({
    example: 'creator',
  }),
  preferred_work_type: z.enum(['full-time', 'part-time', 'contract', 'internship']).openapi({
    example: 'full-time',
  }),
  preferred_domain: z.enum(['creator', 'investor', 'mentor']).openapi({
    example: 'creator',
  }),
  experience_level: z.enum(['junior', 'mid_level', 'senior', 'expert']).openapi({
    example: 'junior',
  }),
})