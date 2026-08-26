/**
 * Fast Lane: Parallel ID Intersection
 */
async function fetchParallelIdIntersection({
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

// Extracted helper for clean fallback streaming
function streamFallbackStore(
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

function verifyCustomFilter(item, filterConfig) {
  const itemValue = item[filterConfig.key];
  const target = filterConfig.raw.value;

  if (filterConfig.type === "range") {
    const variance = filterConfig.raw.variance || 0;
    const numVal = Number(itemValue);
    return (
      numVal >= Number(target) - variance && numVal <= Number(target) + variance
    );
  }

  if (Array.isArray(itemValue)) {
    return itemValue
      .map((v) => String(v).toLowerCase())
      .includes(String(target).toLowerCase());
  }

  return String(itemValue).toLowerCase() === String(target).toLowerCase();
}

/**
 * Executes a high-performance dynamic zig-zag search using raw IndexedDB.
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

  const activeIndexedFilters = [];
  const activeUnindexedFilters = [];

  // 2. Classify filters
  for (const filter of customFilters) {
    if (
      filter.value === "" ||
      filter.value === null ||
      filter.value === undefined
    )
      continue;

    const isIndexed = indexedKeys.has(filter.key);
    let keyRange;

    if (filter.type === "range") {
      const variance = filter.variance || 0;
      const numVal = Number(filter.value);
      keyRange = IDBKeyRange.bound(numVal - variance, numVal + variance);
    } else {
      // Ensure type match (convert string to number if index is numeric)
      const targetVal = isNaN(filter.value)
        ? filter.value
        : Number(filter.value);
      keyRange = IDBKeyRange.only(targetVal);
    }

    const compiledFilter = {
      key: filter.key,
      type: filter.type,
      range: keyRange,
      raw: filter,
    };

    if (isIndexed) {
      activeIndexedFilters.push(compiledFilter);
    } else {
      activeUnindexedFilters.push(compiledFilter);
    }
  }

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
