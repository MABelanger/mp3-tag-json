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
    bpm: "",
    instruments: [], // Now expected to be an Array: ['Guitar', 'Piano']
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

        const matchedItems = [];
        const skipOffset = (page - 1) * pageSize;
        let matchedCount = 0;

        // --- STRATEGY A: INTERSECT MULTIPLE INSTRUMENTS ---
        if (
          Array.isArray(filters.instruments) &&
          filters.instruments.length > 0
        ) {
          const instruments = filters.instruments.map(String);

          // Open parallel requests for each instrument index
          const index = objectStore.index("instrumentsIndex");
          const requests = instruments.map((inst) =>
            index.openCursor(IDBKeyRange.only(inst))
          );

          let cursors = await Promise.all(
            requests.map(
              (req) =>
                new Promise((res) => {
                  req.onsuccess = (e) => res(e.target.result);
                })
            )
          );

          // Primary loop to intersect keys natively without loading records
          while (cursors.every((c) => c !== null)) {
            // Find the primary keys of the underlying tracks
            const keys = cursors.map((c) => c.primaryKey);

            // Check if all cursors currently point to the identical record ID
            const allMatch = keys.every((k) => k === keys[0]);

            if (allMatch) {
              const item = cursors[0].value;

              // Secondary non-indexed filter checks (in-memory, minimal footprint)
              let keepsItem = true;
              if (filters.bpm && item.bpm != filters.bpm) keepsItem = false;
              if (
                filters.minBass &&
                Number(item.bass) < Number(filters.minBass)
              )
                keepsItem = false;

              if (keepsItem) {
                if (
                  matchedCount >= skipOffset &&
                  matchedItems.length < pageSize
                ) {
                  matchedItems.push(item);
                }
                matchedCount++;

                if (matchedItems.length === pageSize) {
                  // Look ahead exactly 1 row to accurately determine pagination availability
                  const nextRequests = cursors.map((c) => {
                    c.continue();
                    return new Promise((res) => {
                      c.request.onsuccess = (e) => res(e.target.result);
                    });
                  });
                  const nextCursors = await Promise.all(nextRequests);
                  if (isMounted)
                    setHasMore(nextCursors.every((c) => c !== null));
                  break;
                }
              }

              // Advance all iterators forward
              const advancePromises = cursors.map((c) => {
                c.continue();
                return new Promise((res) => {
                  c.request.onsuccess = (e) => res(e.target.result);
                });
              });
              cursors = await Promise.all(advancePromises);
            } else {
              // Zig-zag optimization: find the maximum primary key and jump trailing cursors to it
              // Works natively if your primary keys are comparable (numbers/strings)
              const maxKey = keys.reduce(
                (max, current) => (current > max ? current : max),
                keys[0]
              );

              const advancePromises = cursors.map((c, i) => {
                if (keys[i] < maxKey) {
                  c.continue(maxKey); // Skip directly to or past the maximum key
                  return new Promise((res) => {
                    c.request.onsuccess = (e) => res(e.target.result);
                  });
                }
                return Promise.resolve(c);
              });
              cursors = await Promise.all(advancePromises);
            }
          }

          if (matchedItems.length < pageSize) {
            if (isMounted) setHasMore(false);
          }
          finalizeResults();
        }

        // --- STRATEGY B: FALLBACK SINGLE INDEX SCANS (BPM Or Sequential) ---
        else {
          let request;
          if (filters.bpm) {
            request = objectStore
              .index("bpmIndex")
              .openCursor(IDBKeyRange.only(Number(filters.bpm)));
          } else {
            request = objectStore.openCursor();
          }

          request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
              const item = cursor.value;
              let keepsItem = true;

              if (
                filters.minBass &&
                Number(item.bass) < Number(filters.minBass)
              )
                keepsItem = false;

              if (keepsItem) {
                if (
                  matchedCount >= skipOffset &&
                  matchedItems.length < pageSize
                ) {
                  matchedItems.push(item);
                }
                matchedCount++;

                if (matchedItems.length > pageSize) {
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
        }

        function finalizeResults() {
          if (!isMounted) return;
          setResults(matchedItems);
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
