import { useShowDirectoryPicker } from "./hooks/useShowDirectoryPicker";
import { useScanFiles } from "./hooks/useScanFiles";
import { useState } from "react";

export function ReadWriteDirectory() {
  const [dirHandle, setDirHandle] = useState(null);
  const { showDirectoryPicker } = useShowDirectoryPicker();
  const { scanFiles, isScanning, scannedFiles } = useScanFiles();

  async function handleClickScan() {
    const dirHandle = await showDirectoryPicker();
    setDirHandle(dirHandle);
    await scanFiles(dirHandle);
  }
  return (
    <div>
      <pre>{JSON.stringify(scannedFiles)}</pre>
      <button onClick={handleClickScan} disabled={isScanning}>
        {isScanning ? "Reading Media..." : "📁 Select Folder to Deep Scan"}
      </button>
    </div>
  );
}

async function openAndWrite() {
  try {
    // 1. Request read/write access to the directory
    const dirHandle = await window.showDirectoryPicker({ mode: "readwrite" });

    // 2. Read contents of the directory
    for await (const entry of dirHandle.values()) {
      console.log(entry.kind, entry.name);
    }

    // 3. Create or access a file in that directory
    const fileHandle = await dirHandle.getFileHandle("test.txt", {
      create: true,
    });

    // 4. Write data to the file
    const writable = await fileHandle.createWritable();
    await writable.write(
      "Hello, this is a local file being written from the browser!"
    );
    await writable.close();

    console.log("File written successfully!");
  } catch (err) {
    console.error("Error accessing file system:", err);
  }
}
