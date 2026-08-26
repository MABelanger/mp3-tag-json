import { useEffect } from "react";

// 1. Helper to open or upgrade IndexedDB
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("TracksSearchDB", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("tracks")) {
        const objectStore = db.createObjectStore("tracks", {
          keyPath: "id",
          autoIncrement: true,
        });

        // Setup matching indexes for your specific JSON keys
        objectStore.createIndex("bpmIndex", "bpm", { unique: false });

        // FIXED: Removed the duplicate instrumentsIndex creation statement
        objectStore.createIndex("instrumentsIndex", "instruments", {
          unique: false,
          multiEntry: true,
        });

        objectStore.createIndex("cuesIndex", "cues", {
          unique: false,
          multiEntry: true,
        });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

// 2. Helper to clear the database safely before starting a full import
async function clearDatabase(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["tracks"], "readwrite");
    const objectStore = transaction.objectStore("tracks");
    const request = objectStore.clear();

    transaction.oncomplete = () => resolve();
    transaction.onerror = (event) => reject(event.target.error);
  });
}

// 3. Helper to write a single file's contents into IndexedDB synchronously
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

// 4. Memory-safe storage processing loop
async function storeJsonTracksToIndexedDB(jsonTracks) {
  const db = await openDatabase();

  // Wipe out old data safely before we start processing fresh files
  await clearDatabase(db);

  let totalStoredCount = 0;

  for (const jsonTrack of jsonTracks) {
    try {
      console.log("Reading file handle:", jsonTrack);

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
              ? item.instruments.split(",") //.map(Number)
              : item.instruments,
          cues:
            item.cues && typeof item.cues === "string"
              ? item.cues.split(",") //.map(Number)
              : item.cues,
        };
        parsedItemsForThisFile.push(processedItem);
      }

      // Save this specific file's rows immediately and close the transaction
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
    `IndexedDB import complete! Stored ${totalStoredCount} total records across all files.`
  );
}

// 5. Custom React Hook
export function useBuildIndexDb(jsonTracks) {
  async function doBuildIndexDb() {
    if (!jsonTracks || jsonTracks.length === 0) return;

    console.log("Starting IndexedDB population...");
    try {
      await storeJsonTracksToIndexedDB(jsonTracks);
    } catch (err) {
      console.error("IndexedDB Save Failed:", err);
    }
  }

  useEffect(() => {
    doBuildIndexDb();
  }, [jsonTracks]);
}
