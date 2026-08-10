// --- HELPER: Open DB connection safely ---
export function openDatabase() {
  console.log("dbQueries files");
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("TracksSearchDB", 1);
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}
