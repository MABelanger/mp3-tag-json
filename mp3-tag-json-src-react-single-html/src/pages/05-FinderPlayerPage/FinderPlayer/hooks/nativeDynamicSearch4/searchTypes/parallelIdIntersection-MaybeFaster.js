import { verifyCustomFilter } from "./filterUtils2";

/**
 * Fast Lane: Parallel ID Intersection with Parallel Payload Fetching (Scenario A)
 */
export async function fetchParallelIdIntersection({
  rawDb,
  activeIndexedFilters,
  activeUnindexedFilters,
  skipOffset,
  targetLimit,
  pageSize,
}) {
  const tx = rawDb.transaction("tracks", "readonly");
  const store = tx.objectStore("tracks");

  // Fetch all matching primary keys for each index in parallel
  const idListsPromises = activeIndexedFilters.map((f) => {
    return new Promise((res, rej) => {
      const request = store.index(f.key).getAllKeys(f.range);
      request.onerror = () => rej(request.error);
      request.onsuccess = (e) => res(e.target.result);
    });
  });

  try {
    const idLists = await Promise.all(idListsPromises);
    console.log("idLists", idLists);

    // Intersect the ID arrays to find primary keys that match ALL indexed fields
    let intersectedIds = idLists[0] || [];
    for (let i = 1; i < idLists.length; i++) {
      const currentSet = new Set(idLists[i]);
      intersectedIds = intersectedIds.filter((id) => currentSet.has(id));
    }

    if (intersectedIds.length === 0) {
      return { matchedItems: [], hasMore: false };
    }

    // Sort IDs if you want consistent ordering (e.g. ascending)
    intersectedIds.sort((a, b) =>
      typeof a === "number" ? a - b : String(a).localeCompare(b)
    );

    // ----------------------------------------------------
    // SCENARIO A: OPTIMIZED PARALLEL GETS USING THE SAME TX
    // ----------------------------------------------------
    // Instead of looping sequentially, kick off all .get() requests instantly
    const rawItemsPromises = intersectedIds.map((id) => {
      return new Promise((res) => {
        const req = store.get(id);
        // If an item is missing or deleted, resolve as null rather than breaking the transaction
        req.onsuccess = (e) => res(e.target.result || null);
        req.onerror = () => res(null);
      });
    });

    // Wait for all database read requests to resolve concurrently
    const allFetchedItems = await Promise.all(rawItemsPromises);

    const matchedItems = [];
    let currentMatchCount = 0;

    // Process the loaded objects in memory for unindexed matching and pagination
    for (const item of allFetchedItems) {
      if (!item) continue;
      if (matchedItems.length >= targetLimit) break;

      // Validate against remaining unindexed filters
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

    const hasMore = matchedItems.length > pageSize;
    if (hasMore) matchedItems.pop();

    return { matchedItems, hasMore };
  } catch (err) {
    throw err;
  }
}
