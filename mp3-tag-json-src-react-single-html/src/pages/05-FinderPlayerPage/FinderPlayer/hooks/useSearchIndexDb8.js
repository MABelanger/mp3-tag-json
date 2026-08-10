import { useState, useEffect } from "react";
import { executeSearch } from "./dbQueries";

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

  useEffect(() => {
    let isMounted = true;

    async function performSearch() {
      setLoading(true);
      setError(null);

      try {
        const output = await executeSearch({ filters, page, pageSize });

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

  return { setPage, setFilters, filters, results, loading, error, hasMore };
}
