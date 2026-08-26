import { verifyCustomFilter } from "./filterUtils";

/**
 * Fast Lane: Parallel ID Intersection
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

    // Intersect the ID arrays to find primary keys that match ALL indexed fields
    let intersectedIds = idLists[0];
    for (let i = 1; i < idLists.length; i++) {
      const currentSet = new Set(idLists[i]);
      intersectedIds = intersectedIds.filter((id) => currentSet.has(id));
    }

    if (intersectedIds.length === 0) {
      return { matchedItems: [], hasMore: false };
    }

    // Sort IDs if you want consistent ordering (e.g. ascending)
    intersectedIds.sort((a, b) => a - b);

    const matchedItems = [];
    let currentMatchCount = 0;

    // Fetch full object payloads for the intersected IDs
    for (const id of intersectedIds) {
      if (matchedItems.length >= targetLimit) break;

      const item = await new Promise((res) => {
        const req = store.get(id);
        req.onsuccess = (e) => res(e.target.result);
      });

      if (!item) continue;

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
