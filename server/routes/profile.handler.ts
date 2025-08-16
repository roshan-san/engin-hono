import app from "../index"
import { createProfileRoute } from "./profile.routes";
import { createProfile } from "../data-access-layer/profile.dal";

app.openapi(createProfileRoute,async (c)=>{
  const user = c.get("user");
  const body = await c.req.valid('json');
  await createProfile(body, user.id);
  return c.json({message: "Profile Created Successfully"}, 201);
});