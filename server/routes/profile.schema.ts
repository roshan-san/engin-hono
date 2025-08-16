import { z } from '@hono/zod-openapi'

export const InputParamsSchema = z.object({
  id: z
    .string()
    .min(3)
    .openapi({
      param: {
        name: 'id',
        in: 'path',
      },
      example: '1212121',
    }),
})

export const UpdateProfileSchema = z.object({
  username: z.string().min(3).optional(),
  full_name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  user_type: z.enum(['creator', 'investor', 'mentor']).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  preferred_work_type: z.enum(['full-time', 'part-time', 'contract', 'internship']).optional(),
  preferred_domain: z.enum(['creator', 'investor', 'mentor']).optional(),
  experience_level: z.enum(['junior', 'mid_level', 'senior', 'expert']).optional(),
  bio: z.string().optional(),
  onboarding_status: z.string().optional(),
  onboarding_step: z.string().optional(),
}).openapi('UpdateProfile')

export const UserSchema = z
  .object({
    id: z.string().openapi({
      example: '123',
    }),
    username: z.string().openapi({
      example: 'johndoe',
    }),
    full_name: z.string().openapi({
      example: 'John Doe',
    }),
    email: z.string().openapi({
      example: 'john@example.com',
    }),
    user_type: z.enum(['creator', 'investor', 'mentor']).openapi({
      example: 'creator',
    }),
    city: z.string().optional().openapi({
      example: 'San Francisco',
    }),
    state: z.string().optional().openapi({
      example: 'CA',
    }),
    country: z.string().optional().openapi({
      example: 'USA',
    }),
    preferred_work_type: z.enum(['full-time', 'part-time', 'contract', 'internship']).openapi({
      example: 'full-time',
    }),
    preferred_domain: z.enum(['creator', 'investor', 'mentor']).openapi({
      example: 'creator',
    }),
    experience_level: z.enum(['junior', 'mid_level', 'senior', 'expert']).openapi({
      example: 'mid_level',
    }),
    bio: z.string().optional().openapi({
      example: 'Passionate entrepreneur with 5+ years of experience',
    }),
    onboarding_status: z.string().openapi({
      example: 'complete',
    }),
    onboarding_step: z.string().openapi({
      example: 'complete',
    }),
    created_at: z.string().openapi({
      example: '2024-01-01T00:00:00Z',
    }),
    updated_at: z.string().openapi({
      example: '2024-01-01T00:00:00Z',
    }),
  })
  .openapi('User')