import { useState } from "react";
import { recursiveScanFolder } from "./scanFilesUtils";

export function useScanFiles() {
  const [isScanning, setIsScanning] = useState(false);
  async function doScanFiles(dirHandle) {
    setIsScanning(true);
    if (dirHandle) {
      try {
        const scannedFiles = await recursiveScanFolder(dirHandle);
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
