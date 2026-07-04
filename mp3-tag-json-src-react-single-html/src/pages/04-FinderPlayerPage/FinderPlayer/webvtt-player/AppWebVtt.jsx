import { useState } from "react";
import { Player } from "./webvtt-player";

import tags from "./data/tags.json";

function App() {
  console.log(tags);

  return (
    <>
      <Player
        audio="https://umd-mith.github.io/webvtt-player/data/audio.mp3"
        transcript="https://umd-mith.github.io/webvtt-player/data/transcript.vtt"
      />
      hello
      <pre>{JSON.stringify(tags)}</pre>
    </>
  );
}

export default App;
