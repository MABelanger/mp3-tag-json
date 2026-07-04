import { useEffect } from "react";
import { useState } from "react";
import { getFileHandleFromPath } from "./fileHandleUtils";

export function useReadFile(dirRootHandle, filePath) {
  const [fileData, setFileData] = useState({});
  async function getFileDataAsync() {
    // Assume 'dirRootHandle' is your existing FileSystemDirectoryHandle
    // Assume 'filename' is your string (e.g., "notes.txt")

    try {
      // 1. Get the file handle from the directory using the filename
      // const fileHandleOld = await dirRootHandle.getFileHandle(filePath, {
      //   create: false,
      // });

      const fileHandle = await getFileHandleFromPath(
        dirRootHandle,
        filePath,
        false
      );

      // const fileHandle = await getFileHandleFromPath(dirRootHandle, filePath, {
      //   create: false,
      // });

      // 2. Get the File object containing the data
      const file = await fileHandle.getFile();

      // 3. Read the contents as text
      const contents = await file.text();
      const contentsObj = JSON.parse(contents);
      return contentsObj;
    } catch (error) {
      if (error.name === "NotFoundError") {
        console.log(
          `The file "${dirRootHandle.name}/${filePath}" does not exist"`
        );
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
  }, [dirRootHandle, filePath]);

  console.log("fileData", fileData);
  return { fileData };
}
