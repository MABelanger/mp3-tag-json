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
    instruments: [], // Array e.g., ['Guitar', 'Piano']
    cues: [], // Array e.g., ['Intro', 'Bridge']
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

        const matchedItems = [];
        const skipOffset = (page - 1) * pageSize;
        let matchedCount = 0;

        // 1. Gather all individual target search terms across both multiEntry fields
        const queryRequirements = []; // Format: { indexName, term }

        if (Array.isArray(filters.instruments)) {
          filters.instruments.forEach((inst) => {
            if (String(inst).trim())
              queryRequirements.push({
                index: "instrumentsIndex",
                term: String(inst).trim(),
              });
          });
        }
        if (Array.isArray(filters.cues)) {
          filters.cues.forEach((cue) => {
            if (String(cue).trim())
              queryRequirements.push({
                index: "cuesIndex",
                term: String(cue).trim(),
              });
          });
        }

        // --- STRATEGY A: ADVANCED DATABASE INTERSECTION (Zero In-Memory Loops) ---
        if (queryRequirements.length > 0) {
          // Open parallel cursor requests for each individual rule
          const cursorPromises = queryRequirements.map((req) => {
            const idx = objectStore.index(req.index);
            const request = idx.openCursor(IDBKeyRange.only(req.term));
            return new Promise((res) => {
              request.onsuccess = (e) => res(e.target.result);
            });
          });

          let cursors = await Promise.all(cursorPromises);

          // Iterate natively using Zig-zag logic
          while (cursors.every((c) => c !== null)) {
            const primaryKeys = cursors.map((c) => c.primaryKey);

            // Check if all array indexes align on the same record ID
            const allMatch = primaryKeys.every((k) => k === primaryKeys[0]);

            if (allMatch) {
              // Extract the item entirely from the cursor point
              const item = cursors[0].value;

              // Handle optional minor parameters (BPM / Range) if present
              let keepsItem = true;
              if (filters.bpm && item.bpm != filters.bpm) keepsItem = false;
              if (filters.bass && Number(item.bass) < Number(filters.bass))
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
                  // Peeking next item natively to check pagination
                  const peekPromises = cursors.map((c) => {
                    c.continue();
                    return new Promise((res) => {
                      c.request.onsuccess = (e) => res(e.target.result);
                    });
                  });
                  const nextCursors = await Promise.all(peekPromises);
                  if (isMounted)
                    setHasMore(nextCursors.every((c) => c !== null));
                  break;
                }
              }

              // Advance everything forward together
              const advancePromises = cursors.map((c) => {
                c.continue();
                return new Promise((res) => {
                  c.request.onsuccess = (e) => res(e.target.result);
                });
              });
              cursors = await Promise.all(advancePromises);
            } else {
              // --- THE NATIVE ZIG-ZAG SKIP ---
              // Identify the largest primary record key among our current indices
              const maxKey = primaryKeys.reduce(
                (max, current) => (current > max ? current : max),
                primaryKeys[0]
              );

              // Natively skip lagging pointers up to or past the maximum discovered key
              const jumpPromises = cursors.map((c, i) => {
                if (primaryKeys[i] < maxKey) {
                  c.continue(maxKey); // IndexedDB moves directly to this entry via index b-tree
                  return new Promise((res) => {
                    c.request.onsuccess = (e) => res(e.target.result);
                  });
                }
                return Promise.resolve(c); // Pointers already matching or exceeding maxKey wait
              });
              cursors = await Promise.all(jumpPromises);
            }
          }

          if (matchedItems.length < pageSize) {
            if (isMounted) setHasMore(false);
          }
          finalizeResults();
        } else {
          // --- STRATEGY B: FALLBACK STANDARD SCANS (When arrays are completely empty) ---
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
              if (filters.bass && Number(item.bass) < Number(filters.bass))
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
