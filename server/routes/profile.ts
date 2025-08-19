import { zValidator } from "@hono/zod-validator";
import { CreateProfileSchema } from "./profile.schema";
import { desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import type { z } from "zod";
import { type HonoAppContext } from "../lib/auth";
import { withAuth } from "../middlewares/auth.middleware";
import { profiles } from "../lib/db/schema";
import { createProfile, getProfileById } from "../data-access-layer/profile.dal";

  export const profile = new Hono<HonoAppContext>()
  .get("/", async (c) => {
    // By default if there is no withAuth middleware passed, the user can either be null or defined
    const user = c.var.user;
    const profile = await getProfileById(user?.id as string);


    // We always set the status to ensure that type inferences are correct on the client side
    return c.json(profile, 200);
  })
  .post("/", zValidator("json", CreateProfileSchema), withAuth, async (c) => {
    // However here since we have withAuth middleware, the user is always garaunteed to be defined
    const user = c.var.user;

    const body = await c.req.valid("json");

    const profile = await createProfile(body, user?.id as string);
    
    return c.json(profile, 200);
  })
  .get("/:id", async (c) => {
    const { id } = c.req.param();

    const profile = await getProfileById(id);

    return c.json(profile, 200);
  });
