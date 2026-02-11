import { useState } from "react";
import { useMp3TagJson } from "./hooks/useMp3TagJson";
import { Players } from "./player/Players";

function App() {
  const { mp3TagJson, isLoading, error } = useMp3TagJson();

  if (isLoading) {
    return <div>loading mp3-tag.json</div>;
  }

  if (error) {
    return <pre>{error}</pre>;
  }

  console.log(mp3TagJson);

  return (
    <>
      <Players mp3TagJsons={mp3TagJson} />
    </>
  );
}

export default App;
