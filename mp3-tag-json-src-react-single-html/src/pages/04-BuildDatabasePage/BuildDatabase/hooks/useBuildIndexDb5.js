import { useEffect } from "react";
import { db } from "../../../../db/db";

async function storeJsonTracksToIndexedDB(jsonTracks) {
  // 1. Wipe the table clean before re-importing
  await db.tracks.clear();
  let totalStoredCount = 0;

  for (const jsonTrack of jsonTracks) {
    try {
      const file = await jsonTrack.handle.getFile();
      const text = await file.text();
      const jsonData = JSON.parse(text);

      const rawItems = Array.isArray(jsonData) ? jsonData : [jsonData];
      const parsedItemsForThisFile = [];

      for (const item of rawItems) {
        const processedItem = {
          ...item,
          instruments:
            item.instruments && typeof item.instruments === "string"
              ? item.instruments.split(",").map((str) => str.trim())
              : item.instruments,
          cues:
            item.cues && typeof item.cues === "string"
              ? item.cues.split(",").map((str) => str.trim())
              : item.cues,
        };
        parsedItemsForThisFile.push(processedItem);
      }

      // 2. Use bulkAdd to push the parsed file contents instantly
      if (parsedItemsForThisFile.length > 0) {
        await db.tracks.bulkAdd(parsedItemsForThisFile);
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

export function useBuildIndexDb(jsonTracks, onComplete) {
  useEffect(() => {
    async function doBuildIndexDb() {
      if (!jsonTracks || jsonTracks.length === 0) return;

      console.log("Starting IndexedDB population via Dexie...");
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
