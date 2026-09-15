import { useEffect, useState } from "react";
import { getDatabase } from "../../../../../db/db";

function getFilterFileNames(keyword, allFileNames) {
  if (!keyword.trim()) return allFileNames; // If search is empty, return everything
  const lowerKeyword = keyword.toLowerCase();

  const filteredFileNames = allFileNames.filter((fileName) =>
    fileName.toLowerCase().includes(lowerKeyword)
  );

  return filteredFileNames;
}

async function getAllFileNames() {
  const db = await getDatabase();
  const transaction = db.transaction(["tracks"], "readonly");
  const store = transaction.objectStore("tracks");
  const nameIndex = store.index("fileName");

  return new Promise((resolve, reject) => {
    const allFileNames = [];
    const request = nameIndex.openKeyCursor(); // Fast key cursor

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        allFileNames.push(cursor.key);
        cursor.continue();
      } else {
        resolve(allFileNames);
      }
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

export function useFileNamesForm() {
  const [allFileNames, setAllFileNames] = useState([]);
  const [filteredFileNames, setFilteredFileNames] = useState([]); // 👈 2. Track filtered results
  const [isLoading, setIsLoading] = useState(true);

  async function doGetAllKeys() {
    try {
      setIsLoading(true);
      const allFileNames = await getAllFileNames();

      setAllFileNames(allFileNames);
      // setFilteredFileNames(names); // Default to showing everything initially
    } catch (err) {
      console.error("Failed to populate file names:", err);
    } finally {
      setIsLoading(false);
    }
  }

  // 👈 3. Updated function to capture and store the matching strings
  function searchFileName(keyword) {
    const isCanSearch = !isLoading && keyword.length >= 3;
    if (isCanSearch) {
      const filteredFileNames = getFilterFileNames(keyword, allFileNames);

      setFilteredFileNames(filteredFileNames);
    } else {
      setFilteredFileNames([]);
    }
  }

  useEffect(() => {
    doGetAllKeys();
  }, []);

  return {
    allFileNames, // Your raw master list
    filteredFileNames, // 👈 The reactive list to wire to your UI components
    searchFileName, // The search handler
    isLoading,
  };
}
