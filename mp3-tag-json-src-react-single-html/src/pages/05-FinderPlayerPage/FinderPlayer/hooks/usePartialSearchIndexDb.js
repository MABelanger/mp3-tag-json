async function getAllKeys() {
  const db = await getDatabase();
  const transaction = db.transaction(["tracks"], "readonly");
  const store = transaction.objectStore("tracks");
  const nameIndex = store.index("fileName");

  // Wrap the cursor in a Promise so we can return the final array
  return new Promise((resolve, reject) => {
    const allFileNames = [];
    const request = nameIndex.openKeyCursor(); // 👈 Uses the fast key cursor

    request.onsuccess = (event) => {
      const cursor = event.target.result;

      if (cursor) {
        // cursor.key is the actual file name string
        allFileNames.push(cursor.key);
        cursor.continue(); // Move to the next record
      } else {
        // Cursor is finished, resolve the promise with the array
        console.log("allFileNames", allFileNames);
        resolve(allFileNames);
      }
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}
