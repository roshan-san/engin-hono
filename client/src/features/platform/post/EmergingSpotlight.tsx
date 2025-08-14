import { useQuery } from 'convex/react';
import { api } from '@/../convex/_generated/api';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from '@tanstack/react-router';
import { TrendingUp, Sparkles, Heart, MapPin, Users, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

export function EmergingSpotlight() {
  const mostLikedStartup = useQuery(api.startups.queries.getMostLikedStartup);
  const navigate = useNavigate();

  return (
    <div className="bg-background border border-border rounded-xl p-6 shadow-sm h-fit">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full bg-primary/20 border border-primary/30">
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-foreground">Emerging Spotlight</h3>
          <p className="text-sm text-muted-foreground">Most loved startup this week</p>
        </div>
      </div>
      
      {mostLikedStartup === undefined ? (
        // Loading state
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-border/30 bg-muted/20">
            <div className="flex items-start gap-3 mb-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-3 w-full mb-2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ) : mostLikedStartup ? (
        <div className="space-y-4">
          {/* Startup Card */}
          <div 
            className="p-4 rounded-lg border border-border/30 bg-muted/20 cursor-pointer hover:bg-muted/30 transition-all duration-200 hover:shadow-md"
            onClick={() => navigate({ to: '/startups/$startupid', params: { startupid: mostLikedStartup.startup._id } })}
          >
            <div className="flex items-start gap-3 mb-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={mostLikedStartup.founder?.avatar_url} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {mostLikedStartup.founder?.name?.[0] || mostLikedStartup.founder?.username?.[0] || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-base truncate">
                  {mostLikedStartup.startup.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  by {mostLikedStartup.founder?.name || mostLikedStartup.founder?.username || 'Unknown'}
                </p>
              </div>
              <div className="flex items-center gap-1 text-primary">
                <Heart className="w-4 h-4" />
                <span className="text-sm font-medium">{mostLikedStartup.likesCount}</span>
              </div>
            </div>
            
            <p className="text-sm text-foreground/80 line-clamp-2 mb-3">
              {mostLikedStartup.startup.description}
            </p>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{mostLikedStartup.startup.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{mostLikedStartup.startup.team_size} members</span>
              </div>
              {mostLikedStartup.startup.stage && (
                <Badge variant="secondary" className="text-xs">
                  {mostLikedStartup.startup.stage}
                </Badge>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground border-t border-border/30 mt-4">
          <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No trending startups yet</p>
          <p className="text-xs opacity-70 mt-1">Create a startup to see it here!</p>
        </div>
      )}
    </div>
  );
} 