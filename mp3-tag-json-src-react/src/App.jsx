import { useState } from "react";
import { useMp3TagJson } from "./hooks/useMp3TagJson";
import { Mp3Sections } from "./Mp3Sections";
import "./App.css";

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
    <div style={{ backgroundColor: "black", color: "white" }}>
      <Mp3Sections mp3TagJsons={mp3TagJson} />
    </div>
  );
}

export default App;
