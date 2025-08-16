import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { InputParamsSchema, UpdateProfileSchema, UserSchema } from './profile.schema'
import { HonoEnv } from '../types';
import { authMiddleware } from '../middlewares/auth.middleware';



export const profiles = new OpenAPIHono<HonoEnv>()
  .use(authMiddleware);

// PATCH profile by ID
export const updateProfileRoute = createRoute({
  method: 'patch',
  path: '/profile/{id}',
  request:{
    body: {
      content: {
        'application/json': {
          schema: InputParamsSchema
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: UserSchema
        }
      },
      description: 'Profile updated successfully'
    },
    400: {
      description: 'Bad request'
    },
    404: {
      description: 'Profile not found'
    },
    500: {
      description: 'Internal server error'
    }
  }
})
