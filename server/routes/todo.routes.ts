import { createRoute } from '@hono/zod-openapi';
import { Hono } from 'hono';
import { HonoEnv } from '../types';
import { authMiddleware } from '../middlewares/auth.middleware';
import { 
  getTodos, 
  createTodo, 
  updateTodo, 
  deleteTodo 
} from '../handlers/todo.handlers';
import { 
  CreateTodoSchema, 
  UpdateTodoSchema, 
  TodoSchema, 
  TodoListSchema,
  TodoParamsSchema
} from '../schemas/todo.schemas';

export const todos = new Hono<HonoEnv>()
  .use(authMiddleware);

// GET /todos - Get all todos for the authenticated user
const getTodosRoute = createRoute({
  method: 'get',
  path: '/todos',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: TodoListSchema,
        },
      },
      description: 'List of todos for the authenticated user',
    },
    401: {
      description: 'Unauthorized',
    },
    500: {
      description: 'Internal server error',
    },
  },
});

// POST /todos - Create a new todo
const createTodoRoute = createRoute({
  method: 'post',
  path: '/todos',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateTodoSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: TodoSchema,
        },
      },
      description: 'Todo created successfully',
    },
    400: {
      description: 'Invalid input data',
    },
    401: {
      description: 'Unauthorized',
    },
    500: {
      description: 'Internal server error',
    },
  },
});

// PUT /todos/{id} - Update a todo
const updateTodoRoute = createRoute({
  method: 'put',
  path: '/todos/{id}',
  request: {
    params: TodoParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: UpdateTodoSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: TodoSchema,
        },
      },
      description: 'Todo updated successfully',
    },
    400: {
      description: 'Invalid input data',
    },
    401: {
      description: 'Unauthorized',
    },
    404: {
      description: 'Todo not found',
    },
    500: {
      description: 'Internal server error',
    },
  },
});

// DELETE /todos/{id} - Delete a todo
const deleteTodoRoute = createRoute({
  method: 'delete',
  path: '/todos/{id}',
  request: {
    params: TodoParamsSchema,
  },
  responses: {
    200: {
      description: 'Todo deleted successfully',
    },
    401: {
      description: 'Unauthorized',
    },
    404: {
      description: 'Todo not found',
    },
    500: {
      description: 'Internal server error',
    },
  },
});

// Register routes with handlers using regular Hono methods
todos.get('/', getTodos);
todos.post('/', createTodo);
todos.put('/:id', updateTodo);
todos.delete('/:id', deleteTodo);
