import { createRoute } from '@hono/zod-openapi'
import { CreateProfileSchema } from './profile.schema';

export const createProfileRoute= createRoute({
  method:'post',
  path:"/profile",
  request:{
    body:{
      content:{
        "application/json":{
          schema:CreateProfileSchema
        }
      }
    }
  },
  responses:{
    200:{
      description:"Profile Created Succesfully"
    }
  }
})
