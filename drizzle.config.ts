import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './server/lib/db/migrations',
  schema: './server/lib/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
