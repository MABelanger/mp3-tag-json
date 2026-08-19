import { useEffect } from "react";
import { getDatabase } from "../../../../db/db";
import { clearTracksDatabase } from "../../../../db/clearDb";
import { SEARCH_CONFIG } from "../../../../db/config";

// Helper to write a single file's contents into IndexedDB
async function saveSingleFileToDB(db, itemsToStore) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["tracks"], "readwrite");
    const objectStore = transaction.objectStore("tracks");

    for (const item of itemsToStore) {
      objectStore.add(item);
    }

    transaction.oncomplete = () => resolve();
    transaction.onerror = (event) => reject(event.target.error);
  });
}

// 3. New Dynamic Processing Helper
function processItemDynamically(item, config) {
  // Clone the item to avoid direct mutations
  const processedItem = { ...item };

  for (const conf of config) {
    const value = item[conf.key];

    // If it's a multi-value string field, process it into a cleaned array
    if (conf.multiEntry && typeof value === "string") {
      processedItem[conf.key] = value.split(",").map((str) => str.trim());
    }
    // Optional: Cast numeric ranges to actual numbers if they come as strings
    else if (
      conf.type === "range" &&
      typeof value === "string" &&
      value !== ""
    ) {
      const parsed = Number(value);
      if (!isNaN(parsed)) {
        processedItem[conf.key] = parsed;
      }
    }
  }

  return processedItem;
}

async function storeJsonTracksToIndexedDB(jsonTracks) {
  const db = await getDatabase();
  console.log("reload db debug 3!!!", db);
  clearTracksDatabase(db);

  let totalStoredCount = 0;

  for (const jsonTrack of jsonTracks) {
    try {
      const file = await jsonTrack.handle.getFile();
      const text = await file.text();
      const jsonData = JSON.parse(text);

      const rawItems = Array.isArray(jsonData) ? jsonData : [jsonData];
      const parsedItemsForThisFile = [];

      for (const item of rawItems) {
        // Run the item through our dynamic processor using SEARCH_CONFIG
        const processedItem = processItemDynamically(item, SEARCH_CONFIG);
        parsedItemsForThisFile.push(processedItem);
      }

      if (parsedItemsForThisFile.length > 0) {
        await saveSingleFileToDB(db, parsedItemsForThisFile);
        totalStoredCount += parsedItemsForThisFile.length;
      }
    } catch (error) {
      console.error(
        `Error reading ${jsonTrack.handle?.name || "unknown file"}:`,
        error
      );
    }
  }

  console.log(
    `IndexedDB import complete! Stored ${totalStoredCount} total records.`
  );
  return totalStoredCount;
}

// Custom React Hook
export function useBuildIndexDb(jsonTracks, onComplete) {
  useEffect(() => {
    async function doBuildIndexDb() {
      if (!jsonTracks || jsonTracks.length === 0) return;

      console.log("Starting IndexedDB population...");
      try {
        const count = await storeJsonTracksToIndexedDB(jsonTracks);
        if (onComplete) onComplete(count);
      } catch (err) {
        console.error("IndexedDB Save Failed:", err);
      }
    }

    doBuildIndexDb();
  }, [jsonTracks]);
}
