import { useState } from "react";

import { ReadWriteDirectory } from "./ReadWriteDirectory/ReadWriteDirectory";

export function App(props) {
  const [scannedFiles, setScannedFiles] = useState();
  function handleScannedFiles(scannedFiles) {
    setScannedFiles(scannedFiles);
  }
  return (
    <div>
      <ReadWriteDirectory onScannedFiles={handleScannedFiles} />
      <pre>{JSON.stringify(scannedFiles)}</pre>
    </div>
  );
}
