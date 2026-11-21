import { useState } from "react";

import { useShowDirectoryPicker } from "./hooks/useShowDirectoryPicker";
import { useScanFiles } from "./hooks/useScanFiles";

export function ReadWriteDirectory(props) {
  const [dirRootHandle, setDirHandle] = useState(null);
  const { showDirectoryPicker } = useShowDirectoryPicker();
  const { doScanFiles, isScanning } = useScanFiles();

  async function handleClickScan() {
    const dirRootHandle = await showDirectoryPicker();
    setDirHandle(dirRootHandle);
    const scannedFiles = await doScanFiles(dirRootHandle);
    props.onScannedFiles(scannedFiles, dirRootHandle);
  }

  return (
    <div>
      <button onClick={handleClickScan} disabled={isScanning}>
        {isScanning ? "Reading Media..." : "📁 Select Folder to Deep Scan"}
      </button>
    </div>
  );
}
