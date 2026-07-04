import { useState } from "react";

import { useShowDirectoryPicker } from "./hooks/useShowDirectoryPicker";
import { useScanFiles } from "./hooks/useScanFiles";
import { useWriteFile } from "./hooks/useWriteFile";

export function ReadWriteDirectory(props) {
  const [dirRootHandle, setDirHandle] = useState(null);
  const { showDirectoryPicker } = useShowDirectoryPicker();
  const { doScanFiles, isScanning } = useScanFiles();
  const { writeNestedFile, isSaving } = useWriteFile();

  //   const onScannedFilesEvent = useEffectEvent((scannedFiles) => {
  //     // This always has the freshest reference to 'onConnected'
  //     // without ever forcing the useEffect below to re-trigger
  //     props.onScannedFiles(scannedFiles);
  //   });

  //   useEffect(() => {
  //     onScannedFilesEvent(scannedFiles);
  //   }, [scannedFiles]);

  async function handleClickScan() {
    const dirRootHandle = await showDirectoryPicker();
    setDirHandle(dirRootHandle);
    const scannedFiles = await doScanFiles(dirRootHandle);
    props.onScannedFiles(scannedFiles, dirRootHandle);
  }

  async function handleWriteFile() {
    writeNestedFile(
      dirRootHandle,
      "mp3/new01/Norah Jones - Sunrise.mp3.txt",
      "test"
    );
  }
  return (
    <div>
      <button onClick={handleClickScan} disabled={isScanning}>
        {isScanning ? "Reading Media..." : "📁 Select Folder to Deep Scan"}
      </button>

      <button onClick={handleWriteFile} disabled={isScanning}>
        write
      </button>
    </div>
  );
}
