import {
  fetchParallelIdIntersection,
  streamFallbackStore,
} from "./searchTypes";

import { classifyFilters } from "./classifyFilters2";

/**
 * Executes a high-performance dynamic search using raw IndexedDB.
 * Supports strict intersection (AND) alongside multi-value selections (OR).
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

  // 2. Separate OR filters from standard pipeline mapping
  // If a custom filter contains an explicit marker or is derived from an array breakdown, map it to OR logic
  const orFiltersSource = customFilters.filter((f) => f.isOrFilter === true);
  console.log("orFiltersSource", orFiltersSource);
  const remainingFilters = customFilters.filter((f) => !f.isOrFilter);

  // 3. Classify standard filters using your existing utility
  const { activeIndexedFilters, activeUnindexedFilters } = classifyFilters({
    customFilters: remainingFilters,
    indexedKeys,
  });

  // 4. Cleanly classify your new OR filters against schema index visibility
  const activeIndexedOrFilters = [];
  for (const f of orFiltersSource) {
    if (indexedKeys.has(f.key)) {
      // Create IDBKeyRange matches for the OR options
      activeIndexedOrFilters.push({
        key: f.key,
        range: IDBKeyRange.only(f.value),
      });
    } else {
      // If the index doesn't exist, treat it as an unindexed fallback matching criteria
      activeUnindexedFilters.push(f);
    }
  }

  console.log("AND Indexed Filters:", activeIndexedFilters);
  console.log("OR Indexed Filters:", activeIndexedOrFilters);
  console.log("Unindexed Filters:", activeUnindexedFilters);

  // 5. Fallback Lane: No indexed filters of any type are active
  if (
    activeIndexedFilters.length === 0 &&
    activeIndexedOrFilters.length === 0
  ) {
    return streamFallbackStore(
      rawDb,
      activeUnindexedFilters,
      skipOffset,
      targetLimit,
      pageSize
    );
  }

  // 6. Fast Lane: Forward both AND and OR arrays down to your intersection controller
  return fetchParallelIdIntersection({
    rawDb,
    activeIndexedFilters,
    activeIndexedOrFilters, // 👈 Hooked directly into your performance pipeline!
    activeUnindexedFilters,
    skipOffset,
    targetLimit,
    pageSize,
  });
}
