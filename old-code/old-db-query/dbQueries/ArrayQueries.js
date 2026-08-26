// --- LOGIC BLOCK A: Array Intersection Scan (Zig-Zag) ---
export async function executeIntersectionStrategy({
  objectStore,
  queryRequirements,
  filters,
  bounds,
  skipOffset,
  pageSize,
}) {
  const matchedItems = [];
  let matchedCount = 0;
  let hasMore = false;

  const cursorPromises = queryRequirements.map((req) => {
    const idx = objectStore.index(req.index);
    return new Promise((res) => {
      idx.openCursor(IDBKeyRange.only(req.term)).onsuccess = (e) =>
        res(e.target.result);
    });
  });

  let cursors = await Promise.all(cursorPromises);

  while (cursors.every((c) => c !== null)) {
    const primaryKeys = cursors.map((c) => c.primaryKey);
    const allMatch = primaryKeys.every((k) => k === primaryKeys[0]);

    if (allMatch) {
      const item = cursors[0].value;

      // Inline Item Validator
      let keepsItem = true;
      if (filters.bpm && item.bpm != filters.bpm) keepsItem = false;
      if (bounds.hasBass) {
        const itemBass = Number(item.bass);
        if (itemBass < bounds.min || itemBass > bounds.max) keepsItem = false;
      }

      if (keepsItem) {
        if (matchedCount >= skipOffset && matchedItems.length < pageSize) {
          matchedItems.push(item);
        }
        matchedCount++;

        if (matchedItems.length === pageSize) {
          const peekPromises = cursors.map((c) => {
            c.continue();
            return new Promise((res) => {
              c.request.onsuccess = (e) => res(e.target.result);
            });
          });
          const nextCursors = await Promise.all(peekPromises);
          hasMore = nextCursors.every((c) => c !== null);
          break;
        }
      }

      const advancePromises = cursors.map((c) => {
        c.continue();
        return new Promise((res) => {
          c.request.onsuccess = (e) => res(e.target.result);
        });
      });
      cursors = await Promise.all(advancePromises);
    } else {
      const maxKey = Math.max(...primaryKeys);
      const jumpPromises = cursors.map((c, i) => {
        if (primaryKeys[i] < maxKey) {
          c.continue(maxKey);
          return new Promise((res) => {
            c.request.onsuccess = (e) => res(e.target.result);
          });
        }
        return Promise.resolve(c);
      });
      cursors = await Promise.all(jumpPromises);
    }
  }

  return { matchedItems, hasMore };
}
