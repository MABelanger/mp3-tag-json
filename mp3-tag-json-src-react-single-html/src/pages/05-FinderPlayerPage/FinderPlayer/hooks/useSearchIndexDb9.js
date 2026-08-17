import { useState, useEffect } from "react";

import { getDatabase } from "../../../../db/db";
import { executeNativeDynamicSearch } from "./nativeDynamicSearch.js";

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

  // Reset page back to 1 whenever filters change to prevent out-of-bounds pagination bugs
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
        // 1. Resolve the underlying native IDBDatabase instance
        const rawDb = await getDatabase();

        // 2. Transform the local state object into the dynamic array format required by the native engine
        const customFilters = [];

        if (filters.bpm) {
          customFilters.push({
            key: "bpm",
            type: "range",
            value: filters.bpm,
            variance: 5,
          });
        }
        if (filters.bass) {
          customFilters.push({
            key: "bass",
            type: "range",
            value: filters.bass,
            variance: 1,
          });
        }

        // Handle array variables dynamically (instruments and cues)
        if (Array.isArray(filters.instruments)) {
          filters.instruments.forEach((inst) => {
            if (inst)
              customFilters.push({
                key: "instruments",
                type: "exact",
                value: inst,
              });
          });
        }
        if (Array.isArray(filters.cues)) {
          filters.cues.forEach((cue) => {
            if (cue)
              customFilters.push({ key: "cues", type: "exact", value: cue });
          });
        }

        // 3. Execute the native high-performance search
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
  }, [filters, page, pageSize]); // Triggers smoothly when variables update

  return {
    page,
    setPage,
    setFilters: updateFilters, // Replaced with reset-safe wrapper
    filters,
    results,
    loading,
    error,
    hasMore,
  };
}
