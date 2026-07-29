import { useEffect } from "react";

// 1. Helper to open or upgrade IndexedDB
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("TracksSearchDB", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      // Create an object store using an auto-incrementing id as primary key
      if (!db.objectStoreNames.contains("tracks")) {
        const objectStore = db.createObjectStore("tracks", {
          keyPath: "id",
          autoIncrement: true,
        });

        // Add indexes for specific keys you might want to quickly search or filter on later
        objectStore.createIndex("bpmIndex", "bpm", { unique: false });
        objectStore.createIndex("notesIndex", "notes", { unique: false });

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

// 2. Refactored storage function using IndexedDB transactions
async function storeJsonTracksToIndexedDB(jsonTracks) {
  const db = await openDatabase();

  // Open a transaction in 'readwrite' mode
  const transaction = db.transaction(["tracks"], "readwrite");
  const objectStore = transaction.objectStore("tracks");

  // Optional: Clear old items before importing a fresh batch of files
  objectStore.clear();

  for (const jsonTrack of jsonTracks) {
    try {
      console.log("Processing handle:", jsonTrack);

      const file = await jsonTrack.handle.getFile();
      const text = await file.text();
      const jsonData = JSON.parse(text);

      const itemsToStore = Array.isArray(jsonData) ? jsonData : [jsonData];

      // Stream each object into IndexedDB
      for (const item of itemsToStore) {
        // OPTIONAL CLEANUP: Convert "5,6" string into a clean array [5, 6] for easier indexing
        const processedItem = {
          ...item,
          instruments: item.instruments
            ? item.instruments.split(",").map(Number)
            : [],
          cues: item.cues ? item.cues.split(",").map(Number) : [],
        };
        // Add the cleaned up item to the database
        objectStore.add(processedItem);
      }

      console.log(`Successfully stored entries from ${file.name}`);
    } catch (error) {
      // Fixed the variable reference error from the original code (handle -> jsonTrack.handle)
      console.error(
        `Error reading ${jsonTrack.handle?.name || "unknown file"}:`,
        error
      );
    }
  }

  // Confirm when all operations in this transaction successfully finalize
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => {
      console.log("IndexedDB import complete!");
      resolve();
    };
    transaction.onerror = (event) => reject(event.target.error);
  });
}

// 3. Updated React custom hook
export function useBuildIndexDb(jsonTracks) {
  async function doBuildIndexDb() {
    if (!jsonTracks || jsonTracks.length === 0) return;

    console.log("Starting IndexedDB population...");
    await storeJsonTracksToIndexedDB(jsonTracks);
  }

  useEffect(() => {
    doBuildIndexDb();
  }, [jsonTracks]);
}
