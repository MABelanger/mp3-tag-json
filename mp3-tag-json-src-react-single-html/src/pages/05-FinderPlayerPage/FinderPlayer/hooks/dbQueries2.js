import { db } from "./db";
export async function executeSearch({ filters, page, pageSize }) {
  const skipOffset = (page - 1) * pageSize;

  // 1. Calculate Bass boundaries (+/-1 range)
  const hasBassFilter =
    filters.bass !== "" && filters.bass !== null && filters.bass !== undefined;
  const targetBassNum = hasBassFilter ? Number(filters.bass) : 0;
  const minBass = targetBassNum - 1;
  const maxBass = targetBassNum + 1;

  // 2. Calculate BPM boundaries (+/-5 range)
  const hasBpmFilter =
    filters.bpm !== "" && filters.bpm !== null && filters.bpm !== undefined;
  const targetBpmNum = hasBpmFilter ? Number(filters.bpm) : 0;
  const minBpm = targetBpmNum - 5;
  const maxBpm = targetBpmNum + 5;

  // 3. Identify active array tags
  const activeInstruments = (filters.instruments || [])
    .map((i) => String(i).trim())
    .filter(Boolean);
  const activeCues = (filters.cues || [])
    .map((c) => String(c).trim())
    .filter(Boolean);

  let collection;

  // 4. Index Selection Strategy (Pick the most specific index first)
  if (activeInstruments.length > 0) {
    collection = db.tracks.where("instruments").anyOf(activeInstruments);
  } else if (activeCues.length > 0) {
    collection = db.tracks.where("cues").anyOf(activeCues);
  } else if (hasBassFilter) {
    // Primary database range scan for Bass
    collection = db.tracks.where("bass").between(minBass, maxBass, true, true);
  } else if (hasBpmFilter) {
    // Primary database range scan for BPM (+/-5 range inclusive)
    collection = db.tracks.where("bpm").between(minBpm, maxBpm, true, true);
  } else {
    // Fallback full database collection scan
    collection = db.tracks.toCollection();
  }

  // 5. Cross-Filtering Verification Engine (Validates remaining non-indexed criteria)
  collection = collection.and((item) => {
    // Verify ALL selected instruments match the item's array
    if (
      activeInstruments.length > 0 &&
      !activeInstruments.every((inst) => item.instruments?.includes(inst))
    ) {
      return false;
    }

    // Verify ALL selected cues match the item's array
    if (
      activeCues.length > 0 &&
      !activeCues.every((cue) => item.cues?.includes(cue))
    ) {
      return false;
    }

    // Cross-check BPM variance limits (+/-5) if BPM wasn't used as the main index query
    if (hasBpmFilter) {
      const itemBpm = Number(item.bpm);
      if (itemBpm < minBpm || itemBpm > maxBpm) {
        return false;
      }
    }

    // Cross-check Bass variance limits (+/-1) if Bass wasn't used as the main index query
    if (hasBassFilter) {
      const itemBass = Number(item.bass);
      if (itemBass < minBass || itemBass > maxBass) {
        return false;
      }
    }

    return true;
  });

  // 6. Execute Pagination Strategy (Fetch 1 extra item to flag page continuation)
  const matchedItems = await collection
    .offset(skipOffset)
    .limit(pageSize + 1)
    .toArray();

  const hasMore = matchedItems.length > pageSize;

  if (hasMore) {
    matchedItems.pop(); // Trim the extra page checking item
  }

  return { matchedItems, hasMore };
}
