import { useState } from "react";
import { recursiveScanFolder } from "./scanFilesUtils";

export function useScanFiles() {
  const [scannedFiles, setScannedFiles] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  async function doScanFiles(dirHandle) {
    setIsScanning(true);
    if (dirHandle) {
      try {
        const scannedFiles = await recursiveScanFolder(dirHandle);
        setScannedFiles(scannedFiles);
      } catch (error) {
        setIsScanning(false);
      }
    }

    setIsScanning(false);
  }

  return {
    doScanFiles,
    isScanning,
    scannedFiles,
  };
}
