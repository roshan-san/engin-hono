import { hc } from "hono/client";
import { env } from "../../../env";
import type{ AppType } from "../../../server/index";

const api = hc<AppType>(env.CLIENT_URL,{
    init:{
        credentials: "include",
    }
});

export default api;
