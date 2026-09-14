import { verifyCustomFilter } from "./filterUtils2";

/**
 * Fast Lane: Parallel ID Intersection supporting both AND and OR indexed filters
 */
export async function fetchParallelIdIntersection({
  rawDb,
  activeIndexedFilters,
  activeIndexedPartialSearchFilters = [], // 👈 New variable for OR indexed filters
  activeUnindexedFilters,
  skipOffset,
  targetLimit,
  pageSize,
}) {
  const tx = rawDb.transaction("tracks", "readonly");
  const store = tx.objectStore("tracks");

  // 1. Fetch matching primary keys for AND filters in parallel
  const andPromises = activeIndexedFilters.map((f) => {
    return new Promise((res, rej) => {
      const request = store.index(f.key).getAllKeys(f.range);
      request.onerror = () => rej(request.error);
      request.onsuccess = (e) => res(e.target.result);
    });
  });

  // 2. Fetch matching primary keys for OR filters in parallel
  const orPromises = activeIndexedPartialSearchFilters.map((f) => {
    return new Promise((res, rej) => {
      const request = store.index(f.key).getAllKeys(f.range);
      request.onerror = () => rej(request.error);
      request.onsuccess = (e) => res(e.target.result);
    });
  });

  try {
    // Resolve all database requests concurrently
    const [andIdLists, orIdLists] = await Promise.all([
      Promise.all(andPromises),
      Promise.all(orPromises),
    ]);

    // --- STEP A: Process the AND Filters (Intersection) ---
    let intersectedIds = andIdLists[0] || [];
    for (let i = 1; i < andIdLists.length; i++) {
      const currentSet = new Set(andIdLists[i]);
      intersectedIds = intersectedIds.filter((id) => currentSet.has(id));
    }

    // --- STEP B: Process the OR Filters (Union) ---
    let orUnionedIds = null;
    if (activeIndexedPartialSearchFilters.length > 0) {
      const orSet = new Set();
      for (const list of orIdLists) {
        for (const id of list) {
          orSet.add(id);
        }
      }
      orUnionedIds = Array.from(orSet);
    }

    // --- STEP C: Merge AND results with OR results ---
    let finalCandidateIds = [];

    if (activeIndexedFilters.length > 0 && orUnionedIds !== null) {
      // Both AND and OR filters exist: Intersect them
      const orSetLookup = new Set(orUnionedIds);
      finalCandidateIds = intersectedIds.filter((id) => orSetLookup.has(id));
    } else if (activeIndexedFilters.length > 0) {
      // Only AND filters exist
      finalCandidateIds = intersectedIds;
    } else if (orUnionedIds !== null) {
      // Only OR filters exist
      finalCandidateIds = orUnionedIds;
    } else {
      // No indexed filters at all (fallback depends on your system architecture)
      return { matchedItems: [], hasMore: false };
    }

    if (finalCandidateIds.length === 0) {
      return { matchedItems: [], hasMore: false };
    }

    // Sort IDs consistently
    finalCandidateIds.sort((a, b) =>
      typeof a === "number" ? a - b : String(a).localeCompare(b)
    );

    const matchedItems = [];
    let currentMatchCount = 0;
    const BATCH_SIZE = 1000; // Memory safeguard batching

    // 3. Fetch full object payloads in safe chunks
    for (let i = 0; i < finalCandidateIds.length; i += BATCH_SIZE) {
      if (matchedItems.length >= targetLimit) break;

      const batchIds = finalCandidateIds.slice(i, i + BATCH_SIZE);

      const batchPromises = batchIds.map((id) => {
        return new Promise((res) => {
          const req = store.get(id);
          req.onsuccess = (e) => res(e.target.result || null);
          req.onerror = () => res(null);
        });
      });

      const fetchedBatchItems = await Promise.all(batchPromises);

      // Process the safe batch in memory against unindexed filters
      for (const item of fetchedBatchItems) {
        if (!item) continue;
        if (matchedItems.length >= targetLimit) break;

        // Keep using your existing clean .every() check for remaining restrictions
        const passUnindexed = activeUnindexedFilters.every((f) =>
          verifyCustomFilter(item, f)
        );

        if (passUnindexed) {
          if (currentMatchCount >= skipOffset) {
            matchedItems.push(item);
          }
          currentMatchCount++;
        }
      }
    }

    const hasMore = matchedItems.length > pageSize;
    if (hasMore) matchedItems.pop();

    return { matchedItems, hasMore };
  } catch (err) {
    throw err;
  }
}
