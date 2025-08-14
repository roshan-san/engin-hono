import { drizzle } from "drizzle-orm/neon-http";
import { neon, Pool } from "@neondatabase/serverless";
import { env } from '../lib/env';

const sql = neon(env.DATABASE_URL);
export const db = drizzle({ client: sql });
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
});