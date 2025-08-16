import { createRoute } from '@hono/zod-openapi';
import { Hono } from 'hono';
import { HonoEnv } from '../types';
import { 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} from '../handlers/user.handlers';
import { 
  UserParamsSchema, 
  UserSchema, 
  CreateUserSchema, 
  UpdateUserSchema 
} from '../schemas/user.schemas';

export const users = new Hono<HonoEnv>();

// GET /users/{id} - Get user by ID
const getUserRoute = createRoute({
  method: 'get',
  path: '/users/{id}',
  request: {
    params: UserParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
      description: 'Retrieve the user',
    },
    404: {
      description: 'User not found',
    },
  },
});

// POST /users - Create new user
const createUserRoute = createRoute({
  method: 'post',
  path: '/users',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateUserSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
      description: 'User created successfully',
    },
    400: {
      description: 'Invalid input data',
    },
  },
});

// PUT /users/{id} - Update user
const updateUserRoute = createRoute({
  method: 'put',
  path: '/users/{id}',
  request: {
    params: UserParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: UpdateUserSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
      description: 'User updated successfully',
    },
    404: {
      description: 'User not found',
    },
  },
});

// DELETE /users/{id} - Delete user
const deleteUserRoute = createRoute({
  method: 'delete',
  path: '/users/{id}',
  request: {
    params: UserParamsSchema,
  },
  responses: {
    200: {
      description: 'User deleted successfully',
    },
    404: {
      description: 'User not found',
    },
  },
});

// Register routes with handlers using regular Hono methods
users.get('/:id', getUserById);
users.post('/', createUser);
users.put('/:id', updateUser);
users.delete('/:id', deleteUser);
