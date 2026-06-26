import { useState } from "react";

import { useShowDirectoryPicker } from "./hooks/useShowDirectoryPicker";
import { useScanFiles } from "./hooks/useScanFiles";
import { useWriteFile } from "./hooks/useWriteFile";

export function ReadWriteDirectory() {
  const [dirHandle, setDirHandle] = useState(null);
  const { showDirectoryPicker } = useShowDirectoryPicker();
  const { doScanFiles, isScanning, scannedFiles } = useScanFiles();
  const { writeNestedFile, isSaving } = useWriteFile();

  async function handleClickScan() {
    const dirHandle = await showDirectoryPicker();
    setDirHandle(dirHandle);
    await doScanFiles(dirHandle);
  }

  async function handleWriteFile() {
    writeNestedFile(
      dirHandle,
      "mp3/new01/Norah Jones - Sunrise.mp3.txt",
      "test"
    );
  }
  return (
    <div>
      <pre>{JSON.stringify(scannedFiles)}</pre>
      <button onClick={handleClickScan} disabled={isScanning}>
        {isScanning ? "Reading Media..." : "📁 Select Folder to Deep Scan"}
      </button>

      <button onClick={handleWriteFile} disabled={isScanning}>
        write
      </button>
    </div>
  );
}
