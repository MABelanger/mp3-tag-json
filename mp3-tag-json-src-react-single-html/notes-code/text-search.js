// 1. Open (or create) the database
const request = indexedDB.open("SearchDatabase", 1);

// This runs ONLY if the database is new or the version increases
request.onupgradeneeded = (event) => {
  const db = event.target.result;

  // Create an object store with an auto-incrementing primary key ID
  const store = db.createObjectStore("sentences", {
    keyPath: "id",
    autoIncrement: true,
  });

  // Create the multiEntry index targeting the "wordArray" property
  store.createIndex("wordsIndex", "wordArray", {
    multiEntry: true,
    unique: false,
  });
  console.log("Database structure initialized.");
};

request.onsuccess = (event) => {
  const db = event.target.result;
  console.log("Database opened successfully.");

  // Run our seed and search logic
  insertSampleData(db, () => {
    searchWord(db, "you"); // Search for the exact word "you"
    searchWord(db, "i"); // Search for the exact word "i"
  });
};

request.onerror = (event) => {
  console.error("Database error:", event.target.error);
};

// 2. Helper function to insert sample strings
function insertSampleData(db, callback) {
  const transaction = db.transaction("sentences", "readwrite");
  const store = transaction.objectStore("sentences");

  const samples = ["I love you", "IndexedDB is fast", "Where are you going"];

  samples.forEach((text) => {
    // Process text: lowercase it and split it into clean words
    const cleanWords = text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(" ");

    store.put({
      textContent: text,
      wordArray: cleanWords, // e.g., ["i", "love", "you"]
    });
  });

  transaction.oncomplete = () => {
    console.log("Sample data saved successfully.");
    callback();
  };
}

// 3. Helper function to search using IDBKeyRange.only()
function searchWord(db, wordToSearch) {
  const transaction = db.transaction("sentences", "readonly");
  const store = transaction.objectStore("sentences");
  const index = store.index("wordsIndex");

  // Convert search term to lowercase to match our stored array format
  const searchRange = IDBKeyRange.only(wordToSearch.toLowerCase());

  // Fetch full records containing this exact word
  const queryRequest = index.getAll(searchRange);

  queryRequest.onsuccess = () => {
    console.log(`\n--- Search Results for "${wordToSearch}" ---`);
    console.log(`Found ${queryRequest.result.length} match(es):`);

    queryRequest.result.forEach((record) => {
      console.log(`-> Original Text: "${record.textContent}"`);
    });
  };

  queryRequest.onerror = () => {
    console.error("Search failed:", queryRequest.error);
  };
}
