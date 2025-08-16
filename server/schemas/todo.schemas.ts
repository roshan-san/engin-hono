import { z } from '@hono/zod-openapi';
import { IdParamSchema, NameSchema, DescriptionSchema } from './common.schemas';

export const TodoParamsSchema = IdParamSchema;

export const TodoSchema = z.object({
  id: z.string().openapi({
    example: 'todo-123',
  }),
  title: NameSchema,
  description: DescriptionSchema,
  completed: z.boolean().default(false).openapi({
    example: false,
  }),
  userId: z.string().openapi({
    example: 'user-456',
  }),
  createdAt: z.date().openapi({
    example: '2024-01-15T10:30:00Z',
  }),
  updatedAt: z.date().openapi({
    example: '2024-01-15T14:45:00Z',
  }),
}).openapi('Todo');

export const CreateTodoSchema = z.object({
  title: NameSchema,
  description: DescriptionSchema,
});

export const UpdateTodoSchema = CreateTodoSchema.partial().extend({
  completed: z.boolean().optional(),
});

export const TodoListSchema = z.array(TodoSchema).openapi('TodoList');
