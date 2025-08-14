import { api } from "@/../convex/_generated/api";
import { useQuery } from "convex/react";
import StartupCard from "../search-startups/StartupCard";
import { StartupCardSkeleton } from "./StartupCardSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket } from "lucide-react";

export function StartupLists() {
  const myStartups = useQuery(api.startups.queries.getMyStartups);

  if (myStartups === undefined) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StartupCardSkeleton />
        <StartupCardSkeleton />
        <StartupCardSkeleton />
      </div>
    );
  }

  if (myStartups.length === 0) {
    return (
      <Card className="border-dashed border-2 border-muted/50">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Rocket className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <CardTitle className="text-lg">No Startups Yet!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            You haven't created any startups. Click the "Create Startup" button to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  const adaptedStartups = myStartups.map((startup) => ({
    ...startup,
    id: startup._id,
    created_at: startup._creationTime,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {adaptedStartups.map((startup) => (
        <StartupCard key={startup.id} startup={startup} />
      ))}
    </div>
  );
}
