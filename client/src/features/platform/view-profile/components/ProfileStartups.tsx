import { useQuery } from "convex/react";
import type { Doc } from "@/../convex/_generated/dataModel";
import { api } from "@/../convex/_generated/api";
import { useUser } from "@/features/authentication/useUser";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Users, MapPin, DollarSign, ExternalLink, Crown } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface ProfileStartupsProps {
  profile: Doc<"profiles">;
}

export default function ProfileStartups({
  profile,
}: ProfileStartupsProps) {
  const { profile: currentUser } = useUser();
  const startups = useQuery(api.startups.queries.getStartupsByUser, {
    userId: profile?._id ?? "",
  });
  const isOwnProfile = currentUser?._id === profile._id;
  const ownedStartups = startups?.owned || [];
  const collaboratedStartups = startups?.collaborated || [];
  const allStartups = startups?.all || [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground">Startups</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {isOwnProfile ? "Your companies and collaborations" : `${profile.name}'s companies and collaborations`}
            </p>
          </div>
        </div>
        
        <Badge variant="secondary" className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm font-medium w-fit">
          {allStartups.length} startup{allStartups.length !== 1 ? 's' : ''}
        </Badge>
      </div>
      
      {/* Startups List */}
      <div className="space-y-3">
        {allStartups.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
              <Building2 className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/50" />
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-foreground pt-4">No startups yet</h4>
            <p className="text-sm sm:text-base text-muted-foreground max-w-sm sm:max-w-md mx-auto px-4 pt-2">
              {isOwnProfile 
                ? "Start building your startup portfolio by creating your first company." 
                : `${profile.name} hasn't joined any startups yet.`
              }
            </p>
            {isOwnProfile && (
              <div className="pt-4">
                <Link to="/startups">
                  <Button size="sm" className="gap-2 h-9 sm:h-10">
                    <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">Create Startup</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-3">
            {/* Owned Startups */}
            {ownedStartups.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-amber-600" />
                  <h4 className="text-sm sm:text-base font-semibold text-foreground">Founded</h4>
                  <Badge variant="outline" className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 border-amber-200">
                    {ownedStartups.length}
                  </Badge>
                </div>
                {ownedStartups.map((startup: Doc<"startups">) => (
                  <StartupCard key={startup._id} startup={startup} isOwner={true} />
                ))}
              </div>
            )}
            
            {/* Collaborated Startups */}
            {collaboratedStartups.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <h4 className="text-sm sm:text-base font-semibold text-foreground">Collaborating</h4>
                  <Badge variant="outline" className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200">
                    {collaboratedStartups.length}
                  </Badge>
                </div>
                {collaboratedStartups.map((startup: Doc<"startups">) => (
                  <StartupCard key={startup._id} startup={startup} isOwner={false} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface StartupCardProps {
  startup: Doc<"startups">;
  isOwner: boolean;
}

function StartupCard({ startup, isOwner }: StartupCardProps) {
  return (
    <Card className="group border-0 shadow-lg bg-gradient-to-br from-background to-muted/30 hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          {/* Startup Info */}
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm sm:text-base text-foreground truncate">
                    {startup.name}
                  </h4>
                  {isOwner && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 border-amber-200">
                      Founder
                    </Badge>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed pt-1">
                  {startup.description}
                </p>
              </div>
            </div>
            
            {/* Startup Details */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {startup.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                  <span className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                    {startup.location}
                  </span>
                </div>
              )}
              
              {startup.funding && (
                <div className="flex items-center gap-1.5">
                  <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                  <span className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-300">
                    ${startup.funding.toLocaleString()}
                  </span>
                </div>
              )}
              
              {startup.team_size && (
                <div className="flex items-center gap-1.5">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                  <span className="text-xs sm:text-sm text-purple-700 dark:text-purple-300">
                    {startup.team_size} members
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Action */}
          <div className="flex items-center">
            <Link to="/startups/$startupid" params={{ startupid: startup._id }}>
              <Button size="sm" variant="outline" className="gap-2 h-9 sm:h-10">
                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">View</span>
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
