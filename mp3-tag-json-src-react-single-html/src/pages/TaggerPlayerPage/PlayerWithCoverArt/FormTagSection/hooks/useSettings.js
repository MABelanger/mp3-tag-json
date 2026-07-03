import { useEffect } from "react";
import { useState } from "react";

export function useSettings(dirHandle) {
  const [settings, setSettings] = useState({});
  async function getSettingsAsync() {
    // Assume 'dirHandle' is your existing FileSystemDirectoryHandle
    // Assume 'filename' is your string (e.g., "notes.txt")

    const filename = "setting.json";
    try {
      // 1. Get the file handle from the directory using the filename
      const fileHandle = await dirHandle.getFileHandle(filename, {
        create: false,
      });

      // 2. Get the File object containing the data
      const file = await fileHandle.getFile();

      // 3. Read the contents as text
      const contents = await file.text();
      console.log(contents);
      return contents;
    } catch (error) {
      if (error.name === "NotFoundError") {
        console.error("The file does not exist in this directory.");
      } else {
        console.error("Error reading file:", error);
      }
    }
  }

  async function doGetSettings() {
    const jsonSettings = await getSettingsAsync();
    const objSettings = JSON.parse(jsonSettings);
    setSettings(objSettings);
  }
  useEffect(() => {
    doGetSettings();
  }, []);

  return { settings };
}
