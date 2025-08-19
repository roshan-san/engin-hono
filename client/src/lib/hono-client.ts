// Please serve/build the server first to get the types
import { type AppType, type Client } from "../../../server/hc";
import { hc } from "hono/client";
import { env } from "../../../env";

const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<AppType>(...args);

export const client = hcWithType(env.SERVER_URL, {
  init: { credentials: "include" },
});
