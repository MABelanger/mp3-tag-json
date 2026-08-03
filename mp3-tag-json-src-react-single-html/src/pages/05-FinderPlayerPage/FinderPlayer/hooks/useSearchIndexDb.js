import { useState, useEffect } from "react";

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

        // 1. CHOOSE STRATEGY: Use fast indexes for primary filters
        if (filters.bpm) {
          // Keep BPM as a number if it is stored as a number in your JSON
          request = objectStore
            .index("bpmIndex")
            .openCursor(IDBKeyRange.only(Number(filters.bpm)));
        } else if (filters.instruments) {
          // Force string formatting here to match your split(",") string array
          const searchStr = String(filters.instruments).trim();
          request = objectStore
            .index("instrumentsIndex")
            .openCursor(IDBKeyRange.only(searchStr));
        } else if (filters.cues) {
          // Force string formatting here to match your split(",") string array
          const searchStr = String(filters.cues).trim();
          request = objectStore
            .index("cuesIndex")
            .openCursor(IDBKeyRange.only(searchStr));
        } else {
          // Fallback scan
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

            // 2. IN-MEMORY FILTERING: Evaluate combined conditions using string matching
            if (filters.bpm && item.bpm !== Number(filters.bpm))
              keepsItem = false;
            if (
              filters.instruments &&
              !item.instruments?.includes(String(filters.instruments).trim())
            )
              keepsItem = false;
            if (
              filters.cues &&
              !item.cues?.includes(String(filters.cues).trim())
            )
              keepsItem = false;

            // Numeric range slider exclusions (e.g., bass, festive, contact keys)
            if (filters.minBass && item.bass < Number(filters.minBass))
              keepsItem = false;
            if (filters.maxBass && item.bass > Number(filters.maxBass))
              keepsItem = false;

            if (keepsItem) {
              // 3. PAGINATION BOUNDS
              if (skipped < skipOffset) {
                skipped++;
              } else if (matchedItems.length < pageSize) {
                matchedItems.push(item);
              } else {
                if (isMounted) setHasMore(true);
                finalizeResults();
                return;
              }
            }
            cursor.continue();
          } else {
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

    return () => {
      isMounted = false;
    };
  }, [filters, page, pageSize]);

  return { results, loading, error, hasMore };
}
