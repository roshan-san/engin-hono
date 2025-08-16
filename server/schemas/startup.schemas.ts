import { z } from '@hono/zod-openapi';
import { IdParamSchema, NameSchema, DescriptionSchema, EmailSchema } from './common.schemas';

export const StartupParamsSchema = IdParamSchema;

export const StartupSchema = z.object({
  id: z.string().openapi({
    example: 'startup-123',
  }),
  name: NameSchema,
  description: DescriptionSchema,
  industry: z.string().min(1).max(100).openapi({
    example: 'Technology',
  }),
  stage: z.enum(['idea', 'mvp', 'early-traction', 'growth', 'scaled']).openapi({
    example: 'mvp',
  }),
  fundingNeeded: z.number().min(0).openapi({
    example: 50000,
  }),
  location: z.string().min(1).max(100).openapi({
    example: 'San Francisco, CA',
  }),
  founderId: z.string().openapi({
    example: 'user-456',
  }),
  createdAt: z.date().openapi({
    example: '2024-01-15T10:30:00Z',
  }),
  updatedAt: z.date().openapi({
    example: '2024-01-15T14:45:00Z',
  }),
}).openapi('Startup');

export const CreateStartupSchema = z.object({
  name: NameSchema,
  description: DescriptionSchema,
  industry: z.string().min(1).max(100),
  stage: z.enum(['idea', 'mvp', 'early-traction', 'growth', 'scaled']),
  fundingNeeded: z.number().min(0),
  location: z.string().min(1).max(100),
});

export const UpdateStartupSchema = CreateStartupSchema.partial();

export const StartupListSchema = z.array(StartupSchema).openapi('StartupList');

export const StartupSearchQuerySchema = z.object({
  industry: z.string().optional(),
  stage: z.enum(['idea', 'mvp', 'early-traction', 'growth', 'scaled']).optional(),
  location: z.string().optional(),
  minFunding: z.string().optional().transform(val => parseInt(val || '0')),
  maxFunding: z.string().optional().transform(val => parseInt(val || '999999999')),
});

