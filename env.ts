import { z } from 'zod'

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  
  // Better Auth Configuration
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.string().url(),
  
  // URLs
  CLIENT_URL: z.string().url(),
  SERVER_URL: z.string().url(),
  
  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  
  
  
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

// Safe defaults that work in both client and server contexts
const defaultEnv = {
  DATABASE_URL: 'postgresql://localhost:5432/your_database',
  BETTER_AUTH_SECRET: 'your-super-secret-auth-key-here',
  BETTER_AUTH_URL: 'http://localhost:3000',
  CLIENT_URL: 'http://localhost:5000',
  SERVER_URL: 'http://localhost:3000',
  GOOGLE_CLIENT_ID: 'your-google-client-id',
  GOOGLE_CLIENT_SECRET: 'your-google-client-secret',
}

// Try to use process.env if available (server), otherwise use defaults (client)
const envVars = typeof process !== 'undefined' && process.env ? process.env : defaultEnv

export const env = envVars as typeof defaultEnv

// Type-safe environment variables
export type Env = z.infer<typeof envSchema>
