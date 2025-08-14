import { Input } from "@/components/ui/input";
import { useProfileSearch } from "./useProfileSearch";
import ProfileCard from "./ProfileCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Users, Filter } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

// Add userType prop
interface SearchProfilesProps {
  userType?: string;
}

export default function SearchProfiles({ userType }: SearchProfilesProps) {
  const { searchQuery, setSearchQuery, profiles, status, ref, isLoading, isLoadingMore } =
    useProfileSearch();
  
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  // Debounced search with improved performance
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchQuery !== searchQuery) {
        setSearchQuery(localSearchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchQuery, searchQuery, setSearchQuery]);

  // Memoize filtered profiles to prevent unnecessary re-renders
  const filteredProfiles = useMemo(() => {
    if (!profiles || profiles.length === 0) return [];
    return userType
      ? profiles.filter((profile) => profile.user_type === userType)
      : profiles;
  }, [profiles, userType]);

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder={`Search for ${userType?.toLowerCase() || 'profiles'}...`}
          value={localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
          className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-border/50 focus:border-primary transition-all duration-200 bg-background"
        />
        {localSearchQuery && (
          <div className="text-sm text-muted-foreground mt-2">
            Searching for: "{localSearchQuery}"
          </div>
        )}
      </div>

      {/* Results Header */}
      {filteredProfiles && filteredProfiles.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              {filteredProfiles.length} {userType?.toLowerCase() || 'profile'}{filteredProfiles.length !== 1 ? 's' : ''} found
              {localSearchQuery && (
                <span className="text-primary"> for "{localSearchQuery}"</span>
              )}
            </span>
          </div>
          {userType && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>Filtered by: {userType}</span>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredProfiles && filteredProfiles.length > 0 ? (
        <>
          {/* Profiles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
              <ProfileCard key={profile._id} profile={profile} />
            ))}
          </div>
          
          {/* Infinite Scroll Trigger */}
          <div
            ref={ref}
            className="flex items-center justify-center py-8"
          >
            {isLoadingMore ? (
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                <span>Loading more profiles...</span>
              </div>
            ) : status === "CanLoadMore" ? (
              <div className="text-center text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Scroll to load more</p>
              </div>
            ) : status === "Exhausted" ? (
              <div className="text-center text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No more profiles to load</p>
              </div>
            ) : null}
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mb-6">
            <Users className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Profiles Found</h3>
          <p className="text-muted-foreground max-w-md">
            {localSearchQuery 
              ? `No ${userType?.toLowerCase() || 'profiles'} found matching "${localSearchQuery}". Try adjusting your search terms.`
              : `No ${userType?.toLowerCase() || 'profiles'} available at the moment. Check back later!`
            }
          </p>
        </div>
      )}
    </div>
  );
}
