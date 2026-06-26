import { useState } from "react";
import { DirectoryPlayer } from "./DirectoryPlayer/DirectoryPlayer";

import { ReadWriteDirectory } from "./ReadWriteDirectory/ReadWriteDirectory";

export function App(props) {
  const [scannedFiles, setScannedFiles] = useState([]);
  function handleScannedFiles(scannedFiles) {
    setScannedFiles(scannedFiles);
  }

  const mp3Tracks = scannedFiles.filter((scannedFile) => {
    return scannedFile.fileType == "mp3";
  });

  return (
    <div>
      <ReadWriteDirectory onScannedFiles={handleScannedFiles} />
      <DirectoryPlayer tracks={mp3Tracks} />
      <pre>{JSON.stringify(scannedFiles, null, 3)}</pre>
    </div>
  );
}
