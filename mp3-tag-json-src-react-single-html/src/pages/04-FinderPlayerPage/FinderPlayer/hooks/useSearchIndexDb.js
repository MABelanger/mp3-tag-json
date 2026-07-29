import { useState, useEffect } from "react";

// Helper to open the same database
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("TracksSearchDB", 1);
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

export function useSearchIndexDb(filters, page = 1, pageSize = 50) {
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

        let request;

        // 1. CHOOSE STRATEGY: Use fast indexes for primary filters if provided
        if (filters.bpm) {
          const index = objectStore.index("bpmIndex");
          request = index.openCursor(IDBKeyRange.only(Number(filters.bpm)));
        } else if (filters.instrument) {
          const index = objectStore.index("instrumentsIndex");
          request = index.openCursor(IDBKeyRange.only(filters.instrument));
        } else if (filters.cue) {
          const index = objectStore.index("cuesIndex");
          request = index.openCursor(IDBKeyRange.only(filters.cue));
        } else {
          // Fallback: Scan everything if no indexed filter is selected
          request = objectStore.openCursor();
        }

        const matchedItems = [];
        let skipped = 0;
        const skipOffset = (page - 1) * pageSize;

        request.onsuccess = (event) => {
          const cursor = event.target.result;

          if (cursor) {
            const item = cursor.value;
            let keepsItem = true;

            // 2. IN-MEMORY FILTERING: Evaluate non-indexed or compound conditions
            // (e.g., if we used bpmIndex, manually verify instruments here)
            if (filters.bpm && item.bpm !== Number(filters.bpm))
              keepsItem = false;
            if (
              filters.instrument &&
              !item.instruments?.includes(Number(filters.instrument))
            )
              keepsItem = false;
            if (filters.cue && !item.cues?.includes(Number(filters.cue)))
              keepsItem = false;

            // Example range filters (e.g., bass scale 1-5)
            if (filters.minBass && item.bass < Number(filters.minBass))
              keepsItem = false;
            if (filters.maxBass && item.bass > Number(filters.maxBass))
              keepsItem = false;

            if (keepsItem) {
              // 3. PAGINATION: Only save items within the current page bounds
              if (skipped < skipOffset) {
                skipped++;
              } else if (matchedItems.length < pageSize) {
                matchedItems.push(item);
              } else {
                // Found an extra item beyond our limit, meaning there's a next page available
                if (isMounted) setHasMore(true);
                finalizeResults();
                return;
              }
            }
            cursor.continue();
          } else {
            // Cursor exhausted all database elements
            if (isMounted) setHasMore(false);
            finalizeResults();
          }
        };

        function finalizeResults() {
          if (!isMounted) return;
          setResults(matchedItems);
          setLoading(false);
        }

        request.onerror = (event) => {
          if (isMounted) {
            setError(event.target.error);
            setLoading(false);
          }
        };
      } catch (err) {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    }

    performSearch();

    // Cleanup to prevent setting state on unmounted components if filters change rapidly
    return () => {
      isMounted = false;
    };
  }, [filters, page, pageSize]);

  return { results, loading, error, hasMore };
}
