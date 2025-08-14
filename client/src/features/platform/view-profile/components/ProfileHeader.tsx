import  { useState } from "react";
import { MapPin, Briefcase, MessageSquare, Users, Github, Linkedin, User, Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@tanstack/react-router";
import type { Doc } from "@/../convex/_generated/dataModel";
import { Dialog, DialogTrigger, DialogContent, DialogDescription } from "@/components/ui/dialog";
import ConnectionsList from "./ConnectionsList";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { ProfileEditPopover } from "./ProfileEditPopover";

interface ProfileHeaderProps {
  profile: Doc<"profiles">;
  isOwnProfile?: boolean;
}

export function ProfileHeader({ profile, isOwnProfile = false }: ProfileHeaderProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  
  const connection = useQuery(api.connections.queries.getConnectionStatus, {
    receiverId: profile._id,
  });

  const createConnection = useMutation(
    api.connections.mutations.createConnection,
  );
  const rejectConnection = useMutation(
    api.connections.mutations.rejectConnection,
  );

  const handleConnectionAction = async () => {
    setIsConnecting(true);
    try {
      if (!connection) {
        await createConnection({
          receiverId: profile._id,
        });
      } else {
        await rejectConnection({
          id: connection._id,
        });
      }
    } catch (error) {
      console.error("Connection action failed:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const getConnectionButtonContent = () => {
    if (!connection) {
      return {
        icon: <Users className="w-4 h-4" />,
        text: "Connect",
        variant: "outline" as const,
      };
    }
    if (connection.status === "accepted") {
      return {
        icon: <Users className="w-4 h-4" />,
        text: "Connected",
        variant: "default" as const,
      };
    }
    if (connection.status === "pending") {
      return {
        icon: <Users className="w-4 h-4" />,
        text: "Waiting",
        variant: "secondary" as const,
      };
    }
    return {
      icon: <Users className="w-4 h-4" />,
      text: "Connect",
      variant: "outline" as const,
    };
  };

  const connectionButtonContent = getConnectionButtonContent();

  // Show loading state while connection status is being fetched
  if (connection === undefined) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/30 rounded-xl overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/30 rounded-xl overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        {/* Mobile-First Layout */}
        <div className="space-y-3">
          {/* Profile Info - Left-aligned */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <Avatar className="w-20 h-20 sm:w-24 sm:h-24 shadow-lg border-4 border-primary/20">
                <AvatarImage src={profile.avatar_url} alt={profile.name} />
                <AvatarFallback className="text-xl sm:text-2xl font-semibold bg-gradient-to-br from-primary/20 to-primary/40 text-primary">
                  {profile.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              {profile.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-4 border-background flex items-center justify-center">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-full"></div>
                </div>
              )}
            </div>
            
            {/* Profile Details */}
            <div className="flex-1 text-left space-y-2">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                  {profile.name}
                </h1>
                <span className="inline-block text-sm sm:text-base text-muted-foreground font-mono bg-muted/50 px-3 py-1 rounded-full">
                  @{profile.username}
                </span>
              </div>
              
              {profile.bio && (
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                  {profile.bio}
                </p>
              )}

              {/* Social Links - Compact */}
              {(profile.github_url || profile.linkedin_url) && (
                <div className="flex justify-start items-center gap-2 pt-1">
                  {profile.github_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="h-8 w-8 p-0 hover:bg-muted/60 border-muted"
                    >
                      <a href={profile.github_url} target="_blank" rel="noopener noreferrer">
                        <Github className="w-3.5 h-3.5 text-muted-foreground" />
                      </a>
                    </Button>
                  )}
                  
                  {profile.linkedin_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="h-8 w-8 p-0 hover:bg-muted/60 border-muted"
                    >
                      <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-3.5 h-3.5 text-muted-foreground" />
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Action Buttons - Compact and Well-Positioned */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {!isOwnProfile && (
              <Button
                variant="default"
                size="sm"
                asChild
                className="h-9 px-4 font-medium"
              >
                <Link
                  to="/message/$username"
                  params={{ username: profile.username || "" }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message
                </Link>
              </Button>
            )}
            
            {isOwnProfile ? (
              <ProfileEditPopover profile={profile} />
            ) : (
              <Button
                variant={connectionButtonContent.variant}
                size="sm"
                className="h-9 px-4 font-medium"
                onClick={handleConnectionAction}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  connectionButtonContent.icon
                )}
                <span className="ml-2">
                  {isConnecting ? "Processing..." : connectionButtonContent.text}
                </span>
              </Button>
            )}
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-9 px-4 font-medium hover:bg-muted/60 border-muted"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Connections
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogDescription>
                  View connections for this user profile.
                </DialogDescription>
                <ConnectionsList profile={profile} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
