// db.js - Database Manager
let dbInstance = null;

export function getDatabase() {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    // 1. Initiate the connection request
    const request = indexedDB.open("TracksSearchDB", 1);

    // 2. Setup your schema (Runs only the first time the DB is created)
    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create the main tracks store with an auto-incrementing id
      const store = db.createObjectStore("tracks", {
        keyPath: "id",
        autoIncrement: true,
      });

      // Crucial: Declare the high-performance B-Tree indexes you want available
      store.createIndex("bass", "bass", { unique: false });
      store.createIndex("bpm", "bpm", { unique: false });
      store.createIndex("instruments", "instruments", {
        unique: false,
        multiEntry: true,
      });
      store.createIndex("cues", "cues", { unique: false, multiEntry: true });
    };

    // 3. Capture the database connection once it is ready
    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}
