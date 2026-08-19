import { SEARCH_CONFIG } from "./config";

let dbInstance = null;

export function getDatabase() {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open("TracksSearchDB", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // 1. Create the main tracks store
      const store = db.createObjectStore("tracks", {
        keyPath: "id",
        autoIncrement: true,
      });

      // 2. Loop through your configuration safely
      SEARCH_CONFIG.forEach((config) => {
        const options = { unique: false };

        if (config.multiEntry) {
          options.multiEntry = true;
        }

        // Directly create the index without using the brittle .contains() check
        store.createIndex(config.key, config.key, options);
      });
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}
