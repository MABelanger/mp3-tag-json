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

        // MultiEntry index allows you to search individual values inside an array
        // We will convert "5,6" into an array [5, 6] before saving it.
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

// 2. Refactored storage function
async function storeJsonTracksToIndexedDB(jsonTracks) {
  const allParsedItems = [];

  // STEP 1: Read and parse all files FIRST (outside the transaction)
  for (const jsonTrack of jsonTracks) {
    try {
      console.log("Reading file handle:", jsonTrack);

      const file = await jsonTrack.handle.getFile();
      const text = await file.text();
      const jsonData = JSON.parse(text);

      const itemsToStore = Array.isArray(jsonData) ? jsonData : [jsonData];

      for (const item of itemsToStore) {
        // Optional parsing cleanup for array structures
        const processedItem = {
          ...item,
          instruments:
            item.instruments && typeof item.instruments === "string"
              ? item.instruments.split(",").map(Number)
              : item.instruments,
          cues:
            item.cues && typeof item.cues === "string"
              ? item.cues.split(",").map(Number)
              : item.cues,
        };
        allParsedItems.push(processedItem);
      }
    } catch (error) {
      console.error(
        `Error reading ${jsonTrack.handle?.name || "unknown file"}:`,
        error
      );
    }
  }

  // STEP 2: Open database and save everything in one rapid, synchronous transaction
  const db = await openDatabase();
  const transaction = db.transaction(["tracks"], "readwrite");
  const objectStore = transaction.objectStore("tracks");

  // Clear old items before importing fresh ones
  objectStore.clear();

  // Push parsed items safely to the object store
  for (const item of allParsedItems) {
    objectStore.add(item);
  }

  // STEP 3: Wait for transaction completion
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => {
      console.log(
        `IndexedDB import complete! Stored ${allParsedItems.length} records.`
      );
      resolve();
    };
    transaction.onerror = (event) => reject(event.target.error);
  });
}

// 3. Custom React Hook
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
