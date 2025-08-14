import React from "react";
import { useQuery, useMutation } from "convex/react";
import { Users, UserMinus, Crown } from "lucide-react";
import { api } from "@/../convex/_generated/api";
import type { Id, Doc } from "@/../convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CollaboratorsListProps {
  startupId: Id<"startups">;
  isOwner: boolean;
}

export const CollaboratorsList: React.FC<CollaboratorsListProps> = ({ startupId }) => {
  const startup = useQuery(api.startups.queries.getStartup, { startupId });
  const removeCollaborator = useMutation(api.startups.mutations.removeCollaborator);
  const collaborators = startup?.collaborators || [];
  
  const profiles = useQuery(api.profile.queries.getProfilesByIds, { ids: collaborators });
  
  const acceptedApplications = useQuery(api.startups.queries.getAcceptedApplications, { startupId });

  function getProfile(profileId: Id<"profiles">) {
    return profiles?.find((p): p is Doc<"profiles"> => !!p && p._id === profileId);
  }

  function getRole(profileId: Id<"profiles">) {
    return acceptedApplications?.find((app: Doc<"applications">) => app.applicantId === profileId)?.acceptedRole || "Team Member";
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground">Team Members</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Manage your startup's collaborators</p>
          </div>
        </div>
        <Badge variant="secondary" className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm font-medium w-fit">
          {collaborators.length} member{collaborators.length !== 1 ? 's' : ''}
        </Badge>
      </div>
      
      <div className="space-y-3">
        {collaborators.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
              <Users className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/50" />
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-foreground pt-4">No team members yet</h4>
            <p className="text-sm sm:text-base text-muted-foreground max-w-sm sm:max-w-md mx-auto px-4 pt-2">
              Team members will appear here once they join your startup. Start by creating positions to attract talent.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {collaborators.map((collaboratorId: Id<"profiles">) => {
              const profile = getProfile(collaboratorId);
              const role = getRole(collaboratorId);
              const isOwner = startup?.ownerId === collaboratorId;
              
              return (
                <div key={collaboratorId} className="group p-4 sm:p-5 rounded-xl bg-gradient-to-br from-background to-muted/30 border border-muted/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="relative flex-shrink-0">
                        {profile?.avatar_url ? (
                          <img 
                            src={profile.avatar_url} 
                            alt="avatar" 
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2 ring-primary/20 flex-shrink-0" 
                          />
                        ) : (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center flex-shrink-0">
                            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                          </div>
                        )}
                        {isOwner && (
                          <div className="absolute -top-1 -right-1 p-1 bg-amber-500 rounded-full">
                            <Crown className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <h4 className="font-semibold text-sm sm:text-base text-foreground truncate">
                            {profile?.name || "Unknown User"}
                          </h4>
                          {isOwner && (
                            <Badge variant="outline" className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 border-amber-200 w-fit">
                              Founder
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate pt-1">
                          @{profile?.username || "username"}
                        </p>
                        <div className="flex items-center gap-2 pt-2">
                          <Badge variant="secondary" className="text-xs px-2 py-0.5">
                            {role}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {isOwner && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeCollaborator({ startupId, collaboratorId })}
                        className="w-full sm:w-auto gap-2 hover:bg-destructive hover:text-destructive-foreground transition-colors h-9 sm:h-10"
                      >
                        <UserMinus className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm">Remove</span>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}; 