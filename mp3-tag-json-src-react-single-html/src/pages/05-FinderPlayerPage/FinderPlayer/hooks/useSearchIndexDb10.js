import { useState, useEffect } from "react";
import { getDatabase } from "../../../../db/db";
import { executeNativeDynamicSearch } from "./nativeDynamicSearch.js";

// 1. Centralized dynamic configuration file matching your TODO blueprint
const SEARCH_CONFIG = [
  { key: "bpm", type: "range", variance: 5 },
  { key: "bass", type: "range", variance: 1 },
  { key: "instruments", type: "exact" }, // maps 'hashtag' matching style to engine
  { key: "cues", type: "exact" },
];

export function useSearchIndexDb(pageSize = 20) {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    bpm: "",
    instruments: [],
    cues: [],
    bass: "",
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  useEffect(() => {
    let isMounted = true;

    async function performSearch() {
      setLoading(true);
      setError(null);

      try {
        // Safe: Instantly pulls the cached singleton connection from db.js memory
        const rawDb = await getDatabase();
        const customFilters = [];

        // 2. FULLY DYNAMIC CONFIG ENGINE (Resolves your TODO)
        SEARCH_CONFIG.forEach((config) => {
          const userValue = filters[config.key];

          if (userValue === "" || userValue === null || userValue === undefined)
            return;

          if (Array.isArray(userValue)) {
            // Process array tags (instruments, cues) dynamically
            userValue.forEach((val) => {
              if (val) {
                customFilters.push({
                  key: config.key,
                  type: config.type,
                  value: val,
                });
              }
            });
          } else {
            // Process singular range inputs (bpm, bass) dynamically
            customFilters.push({
              key: config.key,
              type: config.type,
              value: userValue,
              variance: config.variance || 0,
            });
          }
        });

        const output = await executeNativeDynamicSearch({
          rawDb,
          customFilters,
          page,
          pageSize,
        });

        if (isMounted) {
          setResults(output.matchedItems);
          setHasMore(output.hasMore);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    }

    performSearch();

    return () => {
      isMounted = false;
    };
  }, [filters, page, pageSize]);

  return {
    page,
    setPage,
    setFilters: updateFilters,
    filters,
    results,
    loading,
    error,
    hasMore,
  };
}
