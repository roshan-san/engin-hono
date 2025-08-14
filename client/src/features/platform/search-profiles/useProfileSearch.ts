import { useState, useEffect } from "react";
import { usePaginatedQuery } from "convex/react";
import { useInView } from "react-intersection-observer";
import { api } from "@/../convex/_generated/api";

export const useProfileSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Use Convex's official pagination hook
  const {
    results: profiles,
    status,
    loadMore,
    isLoading,
  } = usePaginatedQuery(
    api.profile.profileSearch.getProfiles,
    { searchQuery },
    { initialNumItems: 12 }
  );

  // Auto-load more when scrolling
  const { ref } = useInView({
    threshold: 0.1,
    rootMargin: "100px",
    onChange: (inView) => {
      if (inView && status === "CanLoadMore") {
        loadMore(12);
      }
    },
  });

  const resetSearch = () => {
    // The usePaginatedQuery hook handles resetting automatically
    // when the searchQuery changes
  };

  return {
    searchQuery,
    setSearchQuery,
    profiles: profiles || [],
    status,
    loadMore,
    isLoading,
    isLoadingMore: status === "LoadingMore",
    ref,
    resetSearch,
  };
};
