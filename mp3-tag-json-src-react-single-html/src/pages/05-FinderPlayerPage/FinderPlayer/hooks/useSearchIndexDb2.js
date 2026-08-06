import { useState, useEffect } from "react";

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("TracksSearchDB", 1);
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

export function useSearchIndexDb(pageSize = 20) {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    bpm: "120",
    instrument: "",
    minBass: "",
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

        let request;

        // 1. CHOOSE THE BEST INDEX STRATEGY (Pick ONE to drastically reduce rows)
        if (filters.bpm) {
          // Fallback check: try matching both string and number representations
          const numValue = Number(filters.bpm);
          request = objectStore
            .index("bpmIndex")
            .openCursor(IDBKeyRange.only(numValue));
        } else if (filters.instruments) {
          const searchStr = String(filters.instruments).trim();
          request = objectStore
            .index("instrumentsIndex")
            .openCursor(IDBKeyRange.only(searchStr));
        } else if (filters.cues) {
          const searchStr = String(filters.cues).trim();
          request = objectStore
            .index("cuesIndex")
            .openCursor(IDBKeyRange.only(searchStr));
        } else {
          // If no specific criteria, scan everything sequentially
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

            // 2. IN-MEMORY "AND" OPERATION (Evaluates the remaining criteria)
            // Loose matching (==) protects against string/number mismatch bugs
            if (filters.bpm && item.bpm != filters.bpm) {
              keepsItem = false;
            }

            // Map array elements to string to safely match your string array split (",")
            if (filters.instruments) {
              const searchStr = String(filters.instruments).trim();
              const itemInstruments = item.instruments?.map(String) || [];
              console.log("itemInstruments", itemInstruments);
              if (!itemInstruments.includes(searchStr)) keepsItem = false;
            }

            if (filters.cues) {
              const searchStr = String(filters.cues).trim();
              const itemCues = item.cues?.map(String) || [];
              if (!itemCues.includes(searchStr)) keepsItem = false;
            }

            // Numeric slider ranges
            if (filters.minBass && Number(item.bass) < Number(filters.minBass))
              keepsItem = false;
            if (filters.maxBass && Number(item.bass) > Number(filters.maxBass))
              keepsItem = false;

            // 3. STREAMING PAGINATION (Memory safe for massive datasets)
            if (keepsItem) {
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
            cursor.continue(); // Keeps database loop memory footprint low
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
  }, [filters, page, pageSize]); // Listens to nonce changes to rerun search instantly

  return { setPage, setFilters, filters, results, loading, error, hasMore };
}
