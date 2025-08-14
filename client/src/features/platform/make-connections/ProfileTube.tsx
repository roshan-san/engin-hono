import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export default function ProfileTube({
  profileId,
  connectionId,
}: {
  profileId: Id<"profiles">;
  connectionId: Id<"connections">;
}) {
  const profile = useQuery(api.profile.queries.getProfileById, {
    profileId,
  });
  const acceptConnection = useMutation(
    api.connections.mutations.acceptConnection,
  );
  const rejectConnection = useMutation(
    api.connections.mutations.rejectConnection,
  );

  const handleAccept = () => {
    acceptConnection({ id: connectionId });
  };

  const handleReject = () => {
    rejectConnection({ id: connectionId });
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="flex items-center justify-between p-2 rounded-lg transition-colors hover:bg-accent">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Link
          to="/profile/$username"
          params={{ username: profile.username ?? "" }}
          className="flex-shrink-0"
        >
          <Avatar className="w-10 h-10">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback>{profile.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col min-w-0 flex-1">
          <Link
            to="/profile/$username"
            params={{ username: profile.username ?? "" }}
            className="block"
          >
            <span className="font-semibold truncate block">{profile.name}</span>
          </Link>
          <span className="text-sm text-muted-foreground truncate block">
            @{profile.username}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button size="sm" onClick={handleAccept}>
          Accept
        </Button>
        <Button size="sm" variant="destructive" onClick={handleReject}>
          Reject
        </Button>
      </div>
    </div>
  );
}
