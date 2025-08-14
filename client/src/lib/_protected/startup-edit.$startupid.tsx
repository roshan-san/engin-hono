import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel.d.ts";
import { useUser } from "../../features/authentication/useUser";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { StartupEditPage } from "@/features/platform/startup-page/StartupEditPage";

export const Route = createFileRoute("/_protected/startup-edit/$startupid")({
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

  if (!isOwner) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to edit this startup.</p>
        </div>
      </div>
    );
  }

  return <StartupEditPage startup={startup} />;
} 