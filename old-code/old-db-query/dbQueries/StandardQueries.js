// --- LOGIC BLOCK B: Standard / Index-Bound Stream Scan ---
export function executeStandardStrategy({
  objectStore,
  filters,
  bounds,
  skipOffset,
  pageSize,
}) {
  return new Promise((resolve) => {
    const matchedItems = [];
    let matchedCount = 0;
    let request;

    // Pick optimal database entry cursor point
    if (bounds.hasBass) {
      request = objectStore
        .index("bassIndex")
        .openCursor(IDBKeyRange.bound(bounds.min, bounds.max));
    } else if (filters.bpm) {
      request = objectStore
        .index("bpmIndex")
        .openCursor(IDBKeyRange.only(Number(filters.bpm)));
    } else {
      request = objectStore.openCursor();
    }

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (!cursor) {
        return resolve({ matchedItems, hasMore: false });
      }

      const item = cursor.value;
      let keepsItem = true;

      // Filter verification fallbacks
      if (bounds.hasBass && filters.bpm && item.bpm != filters.bpm)
        keepsItem = false;
      if (!bounds.hasBass && filters.bpm && item.bpm != filters.bpm)
        keepsItem = false;
      if (!bounds.hasBass && bounds.hasBass) {
        // Safeguard mapping check
        const itemBass = Number(item.bass);
        if (itemBass < bounds.min || itemBass > bounds.max) keepsItem = false;
      }

      if (keepsItem) {
        if (matchedCount >= skipOffset && matchedItems.length < pageSize) {
          matchedItems.push(item);
        }
        matchedCount++;

        if (matchedItems.length > pageSize) {
          return resolve({ matchedItems, hasMore: true });
        }
      }
      cursor.continue();
    };
  });
}
