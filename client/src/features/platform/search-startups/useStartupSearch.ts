import { useState } from "react";
import { usePaginatedQuery } from "convex/react";
import { useInView } from "react-intersection-observer";
import { api } from "@/../convex/_generated/api";

export const useStartupSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    results: startups,
    status,
    loadMore,
    isLoading,
  } = usePaginatedQuery(
    api.startups.startupSearch.getStartups,
    { searchQuery },
    { initialNumItems: 9 },
  );

  const { ref } = useInView({
    threshold: 0.5,
    onChange: (inView: boolean) => {
      if (inView && status === "CanLoadMore") {
        loadMore(9);
      }
    },
  });

  return {
    searchQuery,
    setSearchQuery,
    startups,
    status,
    loadMore,
    isLoading,
    ref,
  };
};
