import { useState } from "react";
import { recursiveScanFolder } from "./scanFilesUtils";

export function useScanFiles() {
  const [isScanning, setIsScanning] = useState(false);
  async function doScanFiles(dirRootHandle) {
    setIsScanning(true);
    if (dirRootHandle) {
      try {
        const scannedFiles = await recursiveScanFolder(dirRootHandle);
        setIsScanning(false);
        return scannedFiles;
      } catch (error) {
        setIsScanning(false);
      }
    }
  }

  return {
    doScanFiles,
    isScanning,
  };
}
