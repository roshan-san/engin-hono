import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Crown, UserPlus } from "lucide-react";
import type { Doc } from "@/../convex/_generated/dataModel";

interface CollaboratorWithRole extends Doc<"profiles"> {
  role?: string;
  joinedAt?: number;
}

interface StartupTeamProps {
  collaborators: CollaboratorWithRole[];
  owner: Doc<"profiles"> | null;
  teamSize?: number;
}

export function StartupTeam({ collaborators, owner, teamSize }: StartupTeamProps) {
  const displayTeamSize = teamSize || (collaborators.length + (owner ? 1 : 0));
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Team
        </h3>
        <Badge variant="secondary" className="text-xs">
          {displayTeamSize} member{displayTeamSize !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="grid gap-4">
        {/* Owner */}
        {owner && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={owner.avatar_url} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {owner.name?.charAt(0) || owner.username?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="truncate">{owner.name || owner.username || "Unknown User"}</span>
                    <Crown className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      Founder
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {owner.user_type || "Team Member"}
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Collaborators */}
        {collaborators.map((collaborator) => (
          <Card key={collaborator._id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={collaborator.avatar_url} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {collaborator.name?.charAt(0) || collaborator.username?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base truncate">
                    {collaborator.name || collaborator.username || "Unknown User"}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {collaborator.role || collaborator.user_type || "Team Member"}
                  </p>
                  {collaborator.joinedAt && (
                    <p className="text-xs text-muted-foreground">
                      Joined {new Date(collaborator.joinedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}

        {collaborators.length === 0 && (
          <div className="text-center py-8">
            <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-semibold mb-2">No team members yet</h4>
            <p className="text-muted-foreground">
              Start building your team by creating positions and accepting applications
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 