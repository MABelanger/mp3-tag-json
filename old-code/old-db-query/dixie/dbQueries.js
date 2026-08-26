import { db } from "./db";

export async function executeSearch({ filters, page, pageSize }) {
  const skipOffset = (page - 1) * pageSize;

  // 1. Calculate the +/-1 bass boundaries
  const hasBassFilter =
    filters.bass !== "" && filters.bass !== null && filters.bass !== undefined;
  const targetBassNum = hasBassFilter ? Number(filters.bass) : 0;
  const minBass = targetBassNum - 1;
  const maxBass = targetBassNum + 1;

  // 2. Identify array filters
  const activeInstruments = (filters.instruments || [])
    .map((i) => String(i).trim())
    .filter(Boolean);
  const activeCues = (filters.cues || [])
    .map((c) => String(c).trim())
    .filter(Boolean);

  let collection;

  // 3. Select the best entry point for indexing
  if (activeInstruments.length > 0) {
    // Queries array terms natively
    collection = db.tracks.where("instruments").anyOf(activeInstruments);
  } else if (activeCues.length > 0) {
    collection = db.tracks.where("cues").anyOf(activeCues);
  } else if (hasBassFilter) {
    // Queries range natively: minBass <= value <= maxBass (inclusive)
    collection = db.tracks.where("bass").between(minBass, maxBass, true, true);
  } else if (filters.bpm) {
    collection = db.tracks.where("bpm").equals(Number(filters.bpm));
  } else {
    // Full table fallback
    collection = db.tracks.toCollection();
  }

  // 4. Apply cross-filtering logic in memory for remaining criteria
  collection = collection.and((item) => {
    // If we used an instrument index, we still need to make sure ALL requested instruments are present
    if (
      activeInstruments.length > 0 &&
      !activeInstruments.every((inst) => item.instruments?.includes(inst))
    ) {
      return false;
    }

    // Cross-check Cues
    if (
      activeCues.length > 0 &&
      !activeCues.every((cue) => item.cues?.includes(cue))
    ) {
      return false;
    }

    // Cross-check BPM
    if (filters.bpm && item.bpm !== Number(filters.bpm)) {
      return false;
    }

    // Cross-check Bass range
    if (hasBassFilter) {
      const itemBass = Number(item.bass);
      if (itemBass < minBass || itemBass > maxBass) {
        return false;
      }
    }

    return true;
  });

  // 5. Paginate efficiently. We fetch 1 extra item to check for "hasMore" pages.
  const matchedItems = await collection
    .offset(skipOffset)
    .limit(pageSize + 1)
    .toArray();

  const hasMore = matchedItems.length > pageSize;

  // Trim off the extra peeked item if it exists
  if (hasMore) {
    matchedItems.pop();
  }

  return { matchedItems, hasMore };
}
