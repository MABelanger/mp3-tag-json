import { useState } from "react";
import { useBuildIndexDb } from "./hooks/useBuildIndexDb5";

export function BuildDatabase(props) {
  useBuildIndexDb(props.jsonTracks, handleCompleteBuildIndexDb);
  const [isDbReady, setIsDbReady] = useState(false);

  function handleCompleteBuildIndexDb(countItemAddedToIndexDb) {
    console.log("item saved countItemAddedToIndexDb", countItemAddedToIndexDb);
    setIsDbReady(true);
  }

  if (!isDbReady) {
    return <div>Loading db in progress...</div>;
  }
  return (
    <div>
      DB READY !<button onClick={props.onNext}>Next find sound</button>
    </div>
  );
}
