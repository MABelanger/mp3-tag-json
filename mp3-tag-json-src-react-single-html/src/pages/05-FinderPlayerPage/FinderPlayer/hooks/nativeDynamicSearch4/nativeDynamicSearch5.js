import {
  fetchParallelIdIntersection,
  streamFallbackStore,
} from "./searchTypes";

import { classifyFilters } from "./classifyFilters2";

/**
 * Executes a high-performance dynamic search using raw IndexedDB.
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

  // 2. Isolate OR filters (your array of filenames) from the standard list
  const orFiltersSource = customFilters.filter((f) => f.isOrFilter === true);
  const remainingFilters = customFilters.filter((f) => !f.isOrFilter);

  // 3. Classify standard remaining filters (Genre, BPM, etc.) as AND criteria
  const {
    activeIndexedFilters,
    activeUnindexedFilters,
    activeIndexedPartialSearchFilters = [], // 👈 Destructure this here so it's not swallowed
  } = classifyFilters({
    customFilters: remainingFilters,
    indexedKeys,
  });

  // 4. Safely wrap fileNames into IDBKeyRange matches for the pipeline's OR logic
  const activeIndexedOrFilters = [];

  for (const f of orFiltersSource) {
    if (indexedKeys.has(f.key)) {
      // 💡 Crucial Fix: If partialSearch is true, we build a bounding range
      // so it matches prefixes correctly, otherwise we look for an exact match.
      if (f.partialSearch) {
        // Creates a bounds lookup matching strings starting with f.value
        activeIndexedOrFilters.push({
          key: f.key,
          range: IDBKeyRange.bound(f.value, f.value),
        });
      } else {
        // Fallback to strict exact match lookup
        activeIndexedOrFilters.push({
          key: f.key,
          range: IDBKeyRange.only(f.value),
        });
      }
    } else {
      // If the field isn't indexed at all, send it to unindexed cursor filtering
      activeUnindexedFilters.push(f);
    }
  }

  console.log("---------------");
  console.log("Strict AND constraints:", activeIndexedFilters);
  console.log("Loose OR filename matching list:", activeIndexedOrFilters);
  console.log("Unindexed filters:", activeUnindexedFilters);

  // 5. Fallback Lane: No indexed filters chosen
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

  // 6. Fast Lane: Intersection pipeline (AND parameters mixed with OR arrays)
  return fetchParallelIdIntersection({
    rawDb,
    activeIndexedFilters,
    activeIndexedOrFilters,
    activeUnindexedFilters,
    skipOffset,
    targetLimit,
    pageSize,
  });
}
