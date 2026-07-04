import { useEffect } from "react";
import { useState } from "react";

export function useReadFile(dirHandle, filePath) {
  const [fileData, setFileData] = useState({});
  async function getFileDataAsync() {
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
      const contentsObj = JSON.parse(contents);
      return contentsObj;
    } catch (error) {
      if (error.name === "NotFoundError") {
        console.log(`The file "${dirHandle.name}/${filePath}" does not exist"`);
        return {};
      } else {
        console.error("Error reading file:", error);
      }
      return;
    }
  }

  async function doGetFile() {
    const fileDataAsync = await getFileDataAsync();
    setFileData(fileDataAsync);
  }
  useEffect(() => {
    doGetFile();
  }, [dirHandle, filePath]);

  console.log("fileData", fileData);
  return { fileData };
}
