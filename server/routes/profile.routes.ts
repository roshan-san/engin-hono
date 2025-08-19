import { createRoute } from '@hono/zod-openapi'
import { CreateProfileSchema } from './profile.schema';
import { requireAuth } from '../middlewares/auth.middleware';

export const createProfileRoute = createRoute({
  method: 'post',
  path: "/profile",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateProfileSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: "Profile Created Successfully"
    },
    401: {
      description: "Authentication required"
    }
  }
});

// Protected profile route that requires authentication
export const getProfileRoute = createRoute({
  method: 'get',
  path: "/profile",
  responses: {
    200: {
      description: "Profile retrieved successfully"
    },
    401: {
      description: "Authentication required"
    }
  }
});

// Update profile route
export const updateProfileRoute = createRoute({
  method: 'put',
  path: "/profile",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateProfileSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: "Profile updated successfully"
    },
    401: {
      description: "Authentication required"
    }
  }
});
