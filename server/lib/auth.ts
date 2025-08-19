import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "../../env";
import { db } from "./db/db";
import * as schema from "./db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      redirectURI: `${env.SERVER_URL}/api/auth/callback/google`,
    },
  },
  trustedOrigins: [env.CLIENT_URL, env.SERVER_URL],
});

type AuthStatus =
  | "IsAuthenticated"
  | "IsNotAuthenticated"
  | "IsMaybeAuthenticated";

/**
 * Represents the authentication status of an application's routes.
 * This type is used to enforce type safety for route authentication requirements.
 *
 * @typedef {string} AuthStatus
 * @property {"IsAuthenticated"} IsAuthenticated - All routes require authentication
 * @property {"IsNotAuthenticated"} IsNotAuthenticated - No routes require authentication
 * @property {"IsMaybeAuthenticated"} IsMaybeAuthenticated - Some routes may require authentication
 *
 * @example
 * // All routes require auth
 * const app = new Hono<HonoAppContext<"IsAuthenticated">>();
 *
 * // Some routes may require auth (default)
 * const app = new Hono<HonoAppContext<"IsMaybeAuthenticated">>();
 *
 * // No routes require auth
 * const app = new Hono<HonoAppContext<"IsNotAuthenticated">>();
 */
export type HonoAppContext<
  Authenticated extends AuthStatus = "IsMaybeAuthenticated",
> = {
  Variables: {
    user: Authenticated extends "IsAuthenticated"
      ? typeof auth.$Infer.Session.user
      : Authenticated extends "IsNotAuthenticated"
        ? null
        : typeof auth.$Infer.Session.user | null;
    session: Authenticated extends "IsAuthenticated"
      ? typeof auth.$Infer.Session.session
      : Authenticated extends "IsNotAuthenticated"
        ? null
        : typeof auth.$Infer.Session.session | null;
  };
};
