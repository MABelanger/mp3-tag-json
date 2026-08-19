import { SEARCH_CONFIG } from "./config";

// Keep a reference to the active promise, not just the raw instance.
// This prevents multiple overlapping requests from opening parallel databases.
let dbPromise = null;

export function getDatabase() {
  // If a connection attempt is already running or succeeded, return that promise chain
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open("TracksSearchDB", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Fresh initialization setup
      const store = db.createObjectStore("tracks", {
        keyPath: "id",
        autoIncrement: true,
      });

      SEARCH_CONFIG.forEach((config) => {
        const options = { unique: false };
        if (config.multiEntry) {
          options.multiEntry = true;
        }
        store.createIndex(config.key, config.key, options);
      });
    };

    request.onsuccess = (event) => {
      const db = event.target.result;

      // Defensive Fix: If the browser closes this connection later (or on hot-reload),
      // wipe our cache out so the next query re-opens a fresh connection pipeline.
      db.onclose = () => {
        dbPromise = null;
      };

      resolve(db);
    };

    request.onerror = (event) => {
      dbPromise = null; // Clear cache on error
      reject(event.target.error);
    };
  });

  return dbPromise;
}
