export async function clearTracksDatabase(db) {
  return new Promise((resolve, reject) => {
    // 1. Defensively check if the database connection is dead or closing
    if (!db || db.closed || (db.readyState && db.readyState === "closing")) {
      console.warn(
        "Skipping clear: The database connection is closed or closing."
      );
      return resolve();
    }

    // 2. Check if the object store actually exists
    if (!db.objectStoreNames.contains("tracks")) {
      console.warn("Skipping clear: 'tracks' object store does not exist yet.");
      return resolve();
    }

    try {
      // 3. Open a readwrite transaction safely
      const transaction = db.transaction("tracks", "readwrite");
      const store = transaction.objectStore("tracks");

      // 4. Issue the native clear instruction
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);

      transaction.onerror = (event) => reject(event.target.error);
    } catch (error) {
      // Catches DOMException errors if the connection dies right at this millisecond
      console.error("Failed to clear store due to transaction crash:", error);
      resolve(); // Resolve early so it doesn't break your entire app execution chain
    }
  });
}
