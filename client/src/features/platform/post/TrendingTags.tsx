import { useQuery } from 'convex/react';
import { api } from '@/../convex/_generated/api';
import { TrendingUp, Sparkles } from 'lucide-react';

interface TrendingTagsProps {
  onTagClick?: (tag: string) => void;
  selectedTag?: string | null;
}

export function TrendingTags({ onTagClick, selectedTag }: TrendingTagsProps) {
  const trendingTags = useQuery(api.posts.queries.getTrendingTags);

  // Mock trending tags if no data available
  const defaultTags = [
    { tag: 'startup', count: 5 }, { tag: 'tech', count: 4 }, { tag: 'innovation', count: 3 },
    { tag: 'funding', count: 3 }, { tag: 'entrepreneur', count: 2 }, { tag: 'ai', count: 2 },
    { tag: 'fintech', count: 2 }, { tag: 'healthtech', count: 1 }, { tag: 'edtech', count: 1 },
    { tag: 'sustainability', count: 1 }
  ];

  // Handle the response format from backend
  const tags = trendingTags?.length 
    ? trendingTags
    : defaultTags;

  return (
    <div className="bg-background border border-border rounded-xl p-6 shadow-sm h-fit">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full bg-primary/20 border border-primary/30">
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-foreground">Trending Tags</h3>
          <p className="text-sm text-muted-foreground">Popular topics this week</p>
        </div>
      </div>
      
      {tags.length > 0 ? (
        <div className="space-y-4">
          {/* Top Trending Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 6).map((item: { tag: string; count: number }, index: number) => (
              <button
                key={item.tag}
                onClick={() => onTagClick?.(item.tag)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  selectedTag === item.tag
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : index < 3 
                      ? 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20' 
                      : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                }`}
              >
                {index < 3 && <Sparkles className="w-3 h-3 mr-1 inline" />}
                #{item.tag}
                <span className="ml-1 text-xs opacity-70">({item.count})</span>
              </button>
            ))}
          </div>

          {/* More Tags */}
          {tags.length > 6 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border/30">
              {tags.slice(6, 12).map((item: { tag: string; count: number }) => (
                <button
                  key={item.tag}
                  className="px-2 py-1 rounded text-xs font-medium bg-muted/50 text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
                  onClick={() => onTagClick?.(item.tag)}
                >
                  #{item.tag}
                  <span className="ml-1 text-xs opacity-70">({item.count})</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground border-t border-border/30 mt-4">
          <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No trending tags yet</p>
          <p className="text-xs opacity-70 mt-1">Create posts with tags to see them here!</p>
        </div>
      )}
    </div>
  );
} 