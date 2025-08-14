import React, { useState } from 'react';
import { MapPin, ThumbsUp, Eye, Users, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Doc, Id } from '@/../convex/_generated/dataModel';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/../convex/_generated/api';
import { useNavigate } from '@tanstack/react-router';
import { useUser } from '@/features/authentication/useUser';

interface StartupCardProps {
  startup: Doc<'startups'>;
}

const StartupCard: React.FC<StartupCardProps> = ({ startup }) => {
  const navigate = useNavigate();
  const { profile } = useUser();
  const founderProfile = useQuery(api.profile.queries.getProfileById, { profileId: startup.ownerId });
  const hasLiked = useQuery(
    api.startups.queries.hasUserLikedStartup, 
    profile ? { startupId: startup._id } : "skip"
  );
  const [likeLoading, setLikeLoading] = useState(false);
  const toggleLike = useMutation(api.startups.mutations.toggleLikeStartup);

  // Likes logic - Updated for new cached count system
  const [likes, setLikes] = useState(startup.likesCount || 0);
  const [liked, setLiked] = useState(hasLiked || false);

  // Update like state from server response
  React.useEffect(() => {
    setLikes(startup.likesCount || 0);
  }, [startup.likesCount]);

  React.useEffect(() => {
    setLiked(hasLiked || false);
  }, [hasLiked]);

  // Like button handler
  const handleLike = async () => {
    if (!profile) return;
    setLikeLoading(true);
    try {
      const result = await toggleLike({ startupId: startup._id });
      setLikes(result.likesCount);
      setLiked(result.liked);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <div className="bg-background border border-border rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 h-full flex flex-col group">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <Avatar className="w-12 h-12 sm:w-14 sm:h-14">
          <AvatarImage src={founderProfile?.avatar_url} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
            {founderProfile?.name?.charAt(0) || founderProfile?.username?.charAt(0) || '?'}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg sm:text-xl truncate group-hover:text-primary transition-colors">
              {startup.name}
            </h3>
            <CheckCircle className="w-5 h-5 text-primary" />
            {startup.stage && (
              <Badge variant="secondary" className="text-xs">
                {startup.stage}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            by {founderProfile?.name || founderProfile?.username || 'Unknown'}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="mb-5 flex-1">
        <p className="text-sm sm:text-base text-foreground/90 leading-relaxed line-clamp-3">
          {startup.description}
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{startup.team_size} members</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{startup.location}</span>
        </div>
      </div>

      {/* Tags */}
      {startup.tags && startup.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {startup.tags.slice(0, 3).map((tag, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="cursor-pointer hover:bg-primary/10 text-primary border-primary/20 transition-colors"
            >
              {tag.startsWith('#') ? tag : `#${tag}`}
            </Badge>
          ))}
          {startup.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{startup.tags.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
        <div className="flex items-center gap-2">
          <button
            className={`p-2 rounded-full hover:bg-primary/10 transition-all duration-200 disabled:opacity-50 ${
              liked ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary'
            }`}
            onClick={handleLike}
            disabled={likeLoading}
          >
            {likeLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ThumbsUp className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
            )}
          </button>
          <span className="text-sm font-medium">{likes}</span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="hover:bg-primary/10 text-primary border-primary/20 transition-all duration-200 hover:scale-105"
          onClick={() => navigate({ to: '/startups/$startupid', params: { startupid: startup._id } })}
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </div>
    </div>
  );
};

export default StartupCard;


