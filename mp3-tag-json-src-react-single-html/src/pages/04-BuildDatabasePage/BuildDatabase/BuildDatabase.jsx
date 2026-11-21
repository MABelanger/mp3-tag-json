import { useState } from "react";

import { useBuildIndexDb } from "./hooks/useBuildIndexDb9";

export function BuildDatabase(props) {
  useBuildIndexDb(props.scannedFiles, handleCompleteBuildIndexDb);
  const [isDbReady, setIsDbReady] = useState(false);

  function handleCompleteBuildIndexDb(countItemAddedToIndexDb) {
    console.log(" item saved countItemAddedToIndexDb", countItemAddedToIndexDb);
    setIsDbReady(true);
  }

  if (!isDbReady) {
    return <div>Loading db in progress...</div>;
  }

  // DB READY !
  props.onNext();
}
