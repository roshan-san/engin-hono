import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel.d.ts";
import { useUser } from "../../features/authentication/useUser";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { StartupDetailPage } from "@/features/platform/startup-page/StartupDetailPage";

export const Route = createFileRoute("/_protected/startups/$startupid")({
  component: RouteComponent,
});

function RouteComponent() {
  const { startupid } = Route.useParams();
  const startup = useQuery(api.startups.queries.getStartup, {
    startupId: startupid as Id<"startups">,
  });
  const { profile } = useUser();

  if (!startup || !profile) {
    return <FullScreenLoader />;
  }

  const isOwner = startup.ownerId === profile._id;

  return <StartupDetailPage startup={startup} isOwner={isOwner} />;
}
