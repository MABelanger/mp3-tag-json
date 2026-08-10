import { useState, useEffect } from "react";
import {
  openDatabase,
  executeIntersectionStrategy,
  executeStandardStrategy,
} from "./dbQueries";

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
        const db = await openDatabase();
        const transaction = db.transaction(["tracks"], "readonly");
        const objectStore = transaction.objectStore("tracks");

        const skipOffset = (page - 1) * pageSize;

        // 1. Structural Parameter Preparation
        const bounds = {
          hasBass:
            filters.bass !== "" &&
            filters.bass !== undefined &&
            filters.bass !== null,
          min: Number(filters.bass) - 1,
          max: Number(filters.bass) + 1,
        };

        const queryRequirements = [
          ...(Array.isArray(filters.instruments) ? filters.instruments : [])
            .filter((i) => String(i).trim())
            .map((i) => ({
              index: "instrumentsIndex",
              term: String(i).trim(),
            })),
          ...(Array.isArray(filters.cues) ? filters.cues : [])
            .filter((c) => String(c).trim())
            .map((c) => ({ index: "cuesIndex", term: String(c).trim() })),
        ];

        // 2. Clear strategy branching delegation
        let output;
        if (queryRequirements.length > 0) {
          output = await executeIntersectionStrategy({
            objectStore,
            queryRequirements,
            filters,
            bounds,
            skipOffset,
            pageSize,
          });
        } else {
          output = await executeStandardStrategy({
            objectStore,
            filters,
            bounds,
            skipOffset,
            pageSize,
          });
        }

        // 3. React lifecycle commit
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
