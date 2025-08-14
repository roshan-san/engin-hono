import { Input } from "@/components/ui/input";
import StartupCard from "./StartupCard";
import { useStartupSearch } from "./useStartupSearch";
import { Search, Loader2 } from "lucide-react";

export default function SearchStartups() {
  const { searchQuery, setSearchQuery, startups, status, loadMore, ref } =
    useStartupSearch();

  return (
    <div className="h-full flex flex-col gap-3 sm:gap-4">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Search for startups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 sm:pl-12 pr-4 h-10 sm:h-12 rounded-xl border-2 border-border/50 focus:border-primary bg-background transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg"
        />
      </div>

      {/* Results Section */}
      <div className="flex-1 min-h-0">
        {status === "LoadingFirstPage" ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin mb-3 text-primary" />
            <p className="text-base font-medium">Discovering startups...</p>
            <p className="text-xs text-muted-foreground">This may take a moment</p>
          </div>
        ) : startups && startups.length > 0 ? (
          <div className="space-y-3">

            {/* Startup Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {startups.map((startup) => (
                <StartupCard key={startup._id} startup={startup} />
              ))}
            </div>

            {/* Load More Section */}
            <div
              ref={ref}
              className="flex items-center justify-center py-6"
            >
              {status === "LoadingMore" ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm">Loading more startups...</span>
                </div>
              ) : status === "CanLoadMore" ? (
                <button
                  onClick={() => loadMore(9)}
                  className="px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-all duration-200 hover:scale-105 text-sm"
                >
                  Load more startups
                </button>
              ) : (
                <div className="text-center text-muted-foreground">
                  <p className="text-xs">You've reached the end</p>
                  <p className="text-xs">No more startups to load</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted/30 flex items-center justify-center mb-3">
              <Search className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-1 text-foreground">No startups found</h3>
            <p className="text-xs sm:text-sm text-center max-w-sm">
              {searchQuery 
                ? `No startups match "${searchQuery}". Try adjusting your search terms.`
                : "No startups available at the moment. Check back later!"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
