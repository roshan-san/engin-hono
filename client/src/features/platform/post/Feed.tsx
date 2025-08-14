import { usePaginatedQuery, useQuery } from 'convex/react';
import { api } from '@/../convex/_generated/api';
import type { Doc } from '@/../convex/_generated/dataModel';
import { PostCard } from './PostCard';
import { PostCardSkeleton } from './PostCardSkeleton';
import { Sparkles, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface FeedProps {
  selectedTag?: string | null;
  onTagClick?: (tag: string) => void;
}

export function Feed({ selectedTag: externalSelectedTag, onTagClick }: FeedProps) {
  const [internalSelectedTag, setInternalSelectedTag] = useState<string | null>(null);
  
  // Use external tag if provided, otherwise use internal state
  const selectedTag = externalSelectedTag !== undefined ? externalSelectedTag : internalSelectedTag;
  
  const {
    results: pagedPosts,
    status: postsStatus,
    loadMore: loadMorePosts,
  } = usePaginatedQuery(
    selectedTag
      ? api.posts.queries.getPostsByTagPaginated
      : api.posts.queries.getPostsPaginated,
    selectedTag ? { tag: selectedTag } : {},
    { initialNumItems: 10 }
  );

  const trendingTags = useQuery(api.posts.queries.getTrendingTags);

  // Get unique author IDs from posts
  const authorIds = pagedPosts ? [...new Set(pagedPosts.map(post => post.authorId))] : [];
  const authorProfiles = useQuery(api.profile.queries.getProfilesByIds, { 
    ids: authorIds 
  });

  const handleTagClick = (tag: string) => {
    if (onTagClick) {
      onTagClick(tag);
    } else {
      setInternalSelectedTag(internalSelectedTag === tag ? null : tag);
    }
  };

  const clearFilter = () => {
    if (onTagClick) {
      onTagClick('');
    } else {
      setInternalSelectedTag(null);
    }
  };

  // Loading state
  if (pagedPosts === undefined) {
    return (
      <div className="space-y-6">
        {/* Tag Filter Skeleton */}
        <div className="flex flex-wrap gap-2 items-center">
          <Skeleton className="h-4 w-16" />
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-20 rounded-full" />
          ))}
        </div>
        
        {/* Post Skeletons */}
        <div className="space-y-0">
          {[...Array(3)].map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tag Filter */}
      {trendingTags && trendingTags.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-muted-foreground mr-2">Filter by:</span>
          {trendingTags.slice(0, 8).map((item) => (
            <button
              key={item.tag}
              onClick={() => handleTagClick(item.tag)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                selectedTag === item.tag
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              }`}
            >
              #{item.tag}
              <span className="ml-1 text-xs opacity-70">({item.count})</span>
            </button>
          ))}
          {selectedTag && (
            <button
              onClick={clearFilter}
              className="px-3 py-1.5 rounded-md text-sm font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
      )}

      {/* Active Filter Display */}
      {selectedTag && (
        <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            Showing posts tagged with "#{selectedTag}"
          </span>
          <button
            onClick={clearFilter}
            className="ml-auto px-2 py-1 rounded text-xs font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        </div>
      )}

      {/* Posts */}
      {pagedPosts?.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            {selectedTag ? `No posts with tag "#${selectedTag}"` : "No posts yet"}
          </h3>
          <p className="text-muted-foreground">
            {selectedTag ? "Try a different tag or create a post with this tag!" : "Be the first to share something!"}
          </p>
        </div>
      ) : (
        <div className="space-y-0">
          {pagedPosts?.map((post: Doc<'posts'>) => {
            const authorProfile = authorProfiles?.find(profile => profile?._id === post.authorId);
            return (
              <PostCard 
                key={post._id} 
                post={post} 
                authorProfile={authorProfile || null} 
              />
            );
          })}
        </div>
      )}
      {postsStatus === 'CanLoadMore' && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => loadMorePosts(10)}
            className="px-4 py-2 text-sm rounded-md bg-muted hover:bg-muted/80"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
} 