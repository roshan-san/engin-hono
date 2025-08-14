import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Doc } from "@/../convex/_generated/dataModel";

export default function ConnectionsList({ profile }: { profile: Doc<"profiles"> }) {
  const connections = useQuery(api.connections.queries.getConnections, {
    profileId: profile._id,
  });
  const updateConnectionStatus = useMutation(api.connections.mutations.updateConnectionStatus);

  if (!connections) return null;

  return (
    <div className="space-y-4">
      {connections.map((conn: Doc<"connections">) => (
        <Card key={conn._id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Connection with {conn.receiverid}</CardTitle>
            <Badge variant="secondary" className="text-xs capitalize">
              {conn.status}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button size="sm" variant="default" onClick={() => updateConnectionStatus({ connectionId: conn._id, status: "accepted" })}>Accept</Button>
              <Button size="sm" variant="outline" onClick={() => updateConnectionStatus({ connectionId: conn._id, status: "declined" })}>Decline</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 