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

  // 1. Native Schema Inspection: Discover existing indexes dynamically from the raw store
  const txCheck = rawDb.transaction("tracks", "readonly");
  const storeCheck = txCheck.objectStore("tracks");
  const indexedKeys = new Set(storeCheck.indexNames); // Native DOMStringList converted to Set
  txCheck.abort(); // Close inspection transaction immediately

  const activeIndexedFilters = [];
  const activeUnindexedFilters = [];

  // 2. Map and classify user filters at runtime
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
      keyRange = IDBKeyRange.only(filter.value);
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

  const matchedItems = [];
  let currentMatchCount = 0;

  // 3. Fallback Lane: No indexed filters chosen. Stream directly via a raw cursor over the main store.
  if (activeIndexedFilters.length === 0) {
    return new Promise((resolve, reject) => {
      const tx = rawDb.transaction("tracks", "readonly");
      const store = tx.objectStore("tracks");
      const request = store.openCursor();

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
        const passUnindexed = activeUnindexedFilters.every((f) =>
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

  // 4. Fast Lane: True Native Multi-Cursor Zig-Zag Intersection
  return new Promise((resolve, reject) => {
    const tx = rawDb.transaction("tracks", "readonly");
    const store = tx.objectStore("tracks");

    // Open native IDBRequest cursor handles only on properties that are indexed
    const requestPromises = activeIndexedFilters.map((f) => {
      return new Promise((res, rej) => {
        const req = store.index(f.key).openCursor(f.range);
        req.onerror = () => rej(req.error);
        req.onsuccess = (e) => res(e.target.result); // Yields the native IDBCursorWithValue object
      });
    });

    Promise.all(requestPromises)
      .then(async (cursors) => {
        // If any index completely misses, an intersection match is mathematically impossible
        if (cursors.some((c) => !c)) {
          resolve({ matchedItems: [], hasMore: false });
          return;
        }

        try {
          while (matchedItems.length < targetLimit) {
            // Extract the native object Primary Keys
            const currentKeys = cursors.map((c) => c.primaryKey);
            let maxPrimaryKey = currentKeys[0];
            let allIndexesMatch = true;

            // Find out if cursors are pointing to divergent IDs
            for (let i = 1; i < currentKeys.length; i++) {
              if (currentKeys[i] > maxPrimaryKey) {
                maxPrimaryKey = currentKeys[i];
                allIndexesMatch = false;
              } else if (currentKeys[i] < maxPrimaryKey) {
                allIndexesMatch = false;
              }
            }

            if (allIndexesMatch) {
              // MATCH FOUND: Extract the native data object payload
              const fullItemData = cursors[0].value;

              // Immediately drop it into the unindexed filter filter array
              const passUnindexed = activeUnindexedFilters.every((f) =>
                verifyCustomFilter(fullItemData, f)
              );

              if (passUnindexed) {
                if (currentMatchCount >= skipOffset)
                  matchedItems.push(fullItemData);
                currentMatchCount++;
              }

              // Move every cursor ahead sequentially by 1 row
              const advancePromises = cursors.map((c, idx) => {
                return new Promise((res) => {
                  c.request.onsuccess = (e) => {
                    cursors[idx] = e.target.result;
                    res();
                  };
                  c.continue();
                });
              });
              await Promise.all(advancePromises);
            } else {
              // NATIVE ZIG-ZAG LEAP: Fast-forward trailing cursors directly to the maxPrimaryKey target
              const leapPromises = [];
              cursors.forEach((c, idx) => {
                if (c.primaryKey < maxPrimaryKey) {
                  leapPromises.push(
                    new Promise((res) => {
                      c.request.onsuccess = (e) => {
                        cursors[idx] = e.target.result;
                        res();
                      };
                      // B-Tree jump instruction directly down the raw browser thread bridge
                      c.continuePrimaryKey(c.key, maxPrimaryKey);
                    })
                  );
                }
              });
              await Promise.all(leapPromises);
            }

            // Safely break if any index hits the wall and terminates
            if (cursors.some((c) => !c)) break;
          }

          const hasMore = matchedItems.length > pageSize;
          if (hasMore) matchedItems.pop();
          resolve({ matchedItems, hasMore });
        } catch (err) {
          reject(err);
        }
      })
      .catch(reject);
  });
}

// Updated memory-friendly inline property matching validation utility
function verifyCustomFilter(item, filterConfig) {
  const itemValue = item[filterConfig.key];
  const target = filterConfig.raw.value;

  // Handle numerical ranges (e.g., bpm, bass)
  if (filterConfig.type === "range") {
    const variance = filterConfig.raw.variance || 0;
    const numVal = Number(itemValue);
    return (
      numVal >= Number(target) - variance && numVal <= Number(target) + variance
    );
  }

  // Handle array values natively (e.g., instruments, cues)
  if (Array.isArray(itemValue)) {
    return itemValue
      .map((v) => String(v).toLowerCase())
      .includes(String(target).toLowerCase());
  }

  // Fallback for flat strings/exact values
  return String(itemValue).toLowerCase() === String(target).toLowerCase();
}
