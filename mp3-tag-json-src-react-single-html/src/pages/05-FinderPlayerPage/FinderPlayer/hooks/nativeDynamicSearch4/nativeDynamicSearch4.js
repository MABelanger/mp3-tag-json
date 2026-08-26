import {
  fetchParallelIdIntersection,
  streamFallbackStore,
} from "./searchTypes";

import { classifyFilters } from "./classifyFilters";

/**
 * Executes a high-performance dynamic search using raw IndexedDB.
 *
 * @param {IDBDatabase} rawDb - Your open native IDBDatabase instance.
 * @param {Array} customFilters - Array of user-selected custom filters.
 * @param {number} page - Current page number (1-indexed).
 * @param {number} pageSize - Number of items per page.
 */
export async function executeNativeDynamicSearch({
  rawDb,
  customFilters,
  page,
  pageSize,
}) {
  const skipOffset = (page - 1) * pageSize;
  const targetLimit = pageSize + 1;

  // 1. Native Schema Inspection
  const txCheck = rawDb.transaction("tracks", "readonly");
  const storeCheck = txCheck.objectStore("tracks");
  const indexedKeys = new Set(storeCheck.indexNames);
  txCheck.abort();

  // 2. Classify filters (Extracted Function)
  const { activeIndexedFilters, activeUnindexedFilters } = classifyFilters({
    customFilters,
    indexedKeys,
  });

  // 3. Fallback Lane: No indexed filters chosen. Stream directly via cursor.
  if (activeIndexedFilters.length === 0) {
    return streamFallbackStore(
      rawDb,
      activeUnindexedFilters,
      skipOffset,
      targetLimit,
      pageSize
    );
  }

  // 4. Fast Lane: Parallel ID Intersection (Extracted Function)
  return fetchParallelIdIntersection({
    rawDb,
    activeIndexedFilters,
    activeUnindexedFilters,
    skipOffset,
    targetLimit,
    pageSize,
  });
}
