import React, { useState, useMemo } from 'react';
import { MapPin, Eye, Users, CheckCircle, MessageSquare, UserPlus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Doc } from '@/../convex/_generated/dataModel';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/../convex/_generated/api';
import { useNavigate } from '@tanstack/react-router';
import { useUser } from '@/features/authentication/useUser';
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from '@tanstack/react-router';

interface ProfileCardProps {
  profile: Doc<'profiles'>;
}

const ProfileCard: React.FC<ProfileCardProps> = React.memo(({ profile }) => {
  const navigate = useNavigate();
  const { profile: currentProfile } = useUser();
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Only query connection status if we have a current profile
  const connection = useQuery(
    api.connections.queries.getConnectionStatus, 
    currentProfile ? { receiverId: profile._id } : "skip"
  );

  const createConnection = useMutation(api.connections.mutations.createConnection);
  const rejectConnection = useMutation(api.connections.mutations.rejectConnection);

  const handleConnectionAction = async () => {
    if (!currentProfile) return;
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
      console.error('Connection action failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Memoize connection button content to prevent unnecessary re-renders
  const connectionButtonContent = useMemo(() => {
    if (!connection) {
      return {
        icon: <UserPlus className="w-4 h-4" />,
        text: "Connect",
        variant: "outline" as const,
        className: "hover:bg-primary/10 text-primary border-primary/20"
      };
    }
    if (connection.status === "accepted") {
      return {
        icon: <CheckCircle className="w-4 h-4" />,
        text: "Connected",
        variant: "default" as const,
        className: "bg-primary text-primary-foreground"
      };
    }
    if (connection.status === "pending") {
      return {
        icon: <Clock className="w-4 h-4" />,
        text: "Pending",
        variant: "secondary" as const,
        className: "bg-muted text-muted-foreground"
      };
    }
    return {
      icon: <UserPlus className="w-4 h-4" />,
      text: "Connect",
      variant: "outline" as const,
      className: "hover:bg-primary/10 text-primary border-primary/20"
    };
  }, [connection]);

  // Memoize content checks to prevent unnecessary re-renders
  const contentChecks = useMemo(() => ({
    hasBio: profile.bio && profile.bio.trim() !== "",
    hasSkills: profile.skills && profile.skills.length > 0,
    hasLocation: profile.location && profile.location.trim() !== "",
    hasUserType: profile.user_type && profile.user_type.trim() !== "",
    hasSocialLinks: profile.github_url || profile.linkedin_url,
  }), [profile.bio, profile.skills, profile.location, profile.user_type, profile.github_url, profile.linkedin_url]);

  return (
    <div className="bg-background border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="w-12 h-12">
          <AvatarImage src={profile.avatar_url} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {profile.name?.charAt(0) || profile.username?.charAt(0) || '?'}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-base truncate">{profile.name || profile.username}</h3>
            <CheckCircle className="w-4 h-4 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            @{profile.username}
          </p>
        </div>
      </div>

      {/* Bio - Only show if there's actual content */}
      {contentChecks.hasBio && (
        <div className="mb-3">
          <p className="text-sm text-foreground/90 leading-relaxed line-clamp-2">
            {profile.bio}
          </p>
        </div>
      )}
      
      {/* Stats - Only show if we have location or user type */}
      {(contentChecks.hasLocation || contentChecks.hasUserType) && (
        <div className="flex items-center gap-3 mb-3">
          {contentChecks.hasLocation && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>{profile.location}</span>
            </div>
          )}
          {contentChecks.hasUserType && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>{profile.user_type}</span>
            </div>
          )}
        </div>
      )}

      {/* Skills - Only show if there are skills */}
      {contentChecks.hasSkills && profile.skills && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {profile.skills.slice(0, 3).map((skill, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="cursor-pointer hover:bg-primary/10 text-primary border-primary/20 text-xs"
              >
                {skill}
              </Badge>
            ))}
            {profile.skills.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{profile.skills.length - 3}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Social Links - Only show if there are social links */}
      {contentChecks.hasSocialLinks && (
        <div className="flex items-center gap-2 mb-3">
          {profile.github_url && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-7 w-7 p-0 hover:bg-muted/60 border-muted"
            >
              <a href={profile.github_url} target="_blank" rel="noopener noreferrer">
                <FaGithub className="w-3 h-3 text-muted-foreground" />
              </a>
            </Button>
          )}
          
          {profile.linkedin_url && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-7 w-7 p-0 hover:bg-muted/60 border-muted"
            >
              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="w-3 h-3 text-muted-foreground" />
              </a>
            </Button>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-border/50 mt-auto">
        {/* Message Button */}
        <Button
          variant="outline"
          size="sm"
          asChild
          className="flex-1 hover:bg-muted/60 border-muted h-8"
        >
          <Link
            to="/message/$username"
            params={{ username: profile.username || "" }}
          >
            <MessageSquare className="w-3 h-3 mr-1 text-muted-foreground" />
            <span className="text-xs">Message</span>
          </Link>
        </Button>
        
        {/* Connect Button */}
        <Button
          variant={connectionButtonContent.variant}
          size="sm"
          className={`flex-1 h-8 ${connectionButtonContent.className}`}
          onClick={handleConnectionAction}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <div className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-1" />
          ) : (
            connectionButtonContent.icon
          )}
          <span className="text-xs ml-1">
            {isConnecting ? "..." : connectionButtonContent.text}
          </span>
        </Button>
        
        {/* View Profile Button */}
        <Button
          variant="outline"
          size="sm"
          className="flex-1 hover:bg-primary/10 text-primary border-primary/20 h-8"
          onClick={() => navigate({ to: '/profile/$username', params: { username: profile.username || "" } })}
        >
          <Eye className="w-3 h-3 mr-1" />
          <span className="text-xs">View</span>
        </Button>
      </div>
    </div>
  );
});

ProfileCard.displayName = 'ProfileCard';

export default ProfileCard;
