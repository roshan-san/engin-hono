import { z } from '@hono/zod-openapi';

// Common parameter schemas
export const IdParamSchema = z.object({
  id: z.string().min(1).openapi({
    param: {
      name: 'id',
      in: 'path',
    },
    example: '123',
  }),
});

export const PaginationQuerySchema = z.object({
  page: z.string().optional().transform(val => parseInt(val || '1')),
  limit: z.string().optional().transform(val => parseInt(val || '10')),
});

// Common response schemas
export const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
  details: z.any().optional(),
}).openapi('ErrorResponse');

export const SuccessResponseSchema = z.object({
  message: z.string(),
  data: z.any().optional(),
}).openapi('SuccessResponse');

// Common validation schemas
export const EmailSchema = z.string().email().openapi({
  example: 'user@example.com',
});

export const PasswordSchema = z.string().min(8).max(100).openapi({
  example: 'securePassword123',
});

export const NameSchema = z.string().min(1).max(100).openapi({
  example: 'John Doe',
});

export const DescriptionSchema = z.string().min(1).max(1000).optional().openapi({
  example: 'A detailed description of the item',
});

