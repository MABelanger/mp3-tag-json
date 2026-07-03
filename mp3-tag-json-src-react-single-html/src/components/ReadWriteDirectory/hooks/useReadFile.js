import { useEffect } from "react";
import { useState } from "react";

export function useReadFile(dirHandle, filePath) {
  const [fileData, setFileData] = useState({});
  async function getSettingsAsync() {
    // Assume 'dirHandle' is your existing FileSystemDirectoryHandle
    // Assume 'filename' is your string (e.g., "notes.txt")

    try {
      // 1. Get the file handle from the directory using the filename
      const fileHandle = await dirHandle.getFileHandle(filePath, {
        create: false,
      });

      // 2. Get the File object containing the data
      const file = await fileHandle.getFile();

      // 3. Read the contents as text
      const contents = await file.text();
      console.log("contents", contents);
      return contents;
    } catch (error) {
      if (error.name === "NotFoundError") {
        console.error("The file does not exist in this directory.");
      } else {
        console.error("Error reading file:", error);
      }
    }
  }

  async function doGetFile() {
    const jsonSettings = await getSettingsAsync();
    const objSettings = JSON.parse(jsonSettings);
    setFileData(objSettings);
  }
  useEffect(() => {
    doGetFile();
  }, [dirHandle, filePath]);

  console.log("fileData", fileData);
  return { fileData };
}
