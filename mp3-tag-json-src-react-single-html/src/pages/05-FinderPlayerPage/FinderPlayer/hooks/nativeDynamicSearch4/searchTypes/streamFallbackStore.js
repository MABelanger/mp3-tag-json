import { verifyCustomFilter } from "./filterUtils";

// Extracted helper for clean fallback streaming
export function streamFallbackStore(
  rawDb,
  unindexedFilters,
  skipOffset,
  targetLimit,
  pageSize
) {
  return new Promise((resolve, reject) => {
    const tx = rawDb.transaction("tracks", "readonly");
    const store = tx.objectStore("tracks");
    const request = store.openCursor();
    const matchedItems = [];
    let currentMatchCount = 0;

    request.onerror = () => reject(request.error);
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (!cursor || matchedItems.length >= targetLimit) {
        const hasMore = matchedItems.length > pageSize;
        if (hasMore) matchedItems.pop();
        resolve({ matchedItems, hasMore });
        return;
      }

      const item = cursor.value;
      const passUnindexed = unindexedFilters.every((f) =>
        verifyCustomFilter(item, f)
      );

      if (passUnindexed) {
        if (currentMatchCount >= skipOffset) matchedItems.push(item);
        currentMatchCount++;
      }
      cursor.continue();
    };
  });
}
