// db.js - Add this function to your existing file

/**
 * Completely clears all records from the 'tracks' store while preserving indexes.
 * @returns {Promise<void>} Resolves when the database is successfully cleared.
 */
export async function clearTracksDatabase(db) {
  // 1. Get the current active database instance securely
  //   const db = await getDatabase();

  return new Promise((resolve, reject) => {
    // 2. Open a readwrite transaction specifically on the tracks store
    const transaction = db.transaction("tracks", "readwrite");
    const store = transaction.objectStore("tracks");

    // 3. Issue the native clear instruction
    const request = store.clear();

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}
