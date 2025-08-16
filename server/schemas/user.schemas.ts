import { z } from '@hono/zod-openapi';
import { IdParamSchema, NameSchema, EmailSchema } from './common.schemas';

export const UserParamsSchema = IdParamSchema;

export const UserSchema = z
  .object({
    id: z.string().openapi({
      example: '123',
    }),
    name: NameSchema,
    email: EmailSchema,
    age: z.number().min(0).max(150).openapi({
      example: 42,
    }),
    createdAt: z.date().openapi({
      example: '2024-01-15T10:30:00Z',
    }),
    updatedAt: z.date().openapi({
      example: '2024-01-15T14:45:00Z',
    }),
  })
  .openapi('User');

export const CreateUserSchema = z.object({
  name: NameSchema,
  email: EmailSchema,
  age: z.number().min(0).max(150),
});

export const UpdateUserSchema = CreateUserSchema.partial();

export const UserListSchema = z.array(UserSchema).openapi('UserList');
