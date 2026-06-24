import { useCallback, useEffect, useRef, useState } from "react";
import { Mp3Section } from "./Mp3Section";

export function App(props) {
  const [playingIndex, setPlayingIndex] = useState(0);

  const mp3TagJson = {
    mp3RelativePath:
      "file:///home/data/my_data/dev/dj-project/mp3-tag-json/data/mp3/new01/Norah Jones - Don't Know Why.mp3",
    md5sum: "99d08e8691b0c6aea94eba4d93900b78",
    duration: "03:28",
    bpm: "+-76",
    instrumentOrTypes: "piano",
    expention: "5",
    festive: "6",
    contact: "4",
    rythmic: "4",
    bass: "4",
    curve: "8",
    note: "hello world i tray some thing new i would like to know if is ok maybe i want the text bigger",
  };

  fetch(
    "file:///home/data/my_data/dev/dj-project/mp3-tag-json/data/mp3/new01/Norah%20Jones%20-%20Don't%20Know%20Why.mp3"
  )
    .then((response) => response.text())
    .then((data) => console.log("Success! Flag is ACTIVE:", data))
    .catch((err) => console.error("Failed! Flag is INACTIVE:", err));

  return (
    <audio controls>
      <source
        src={
          "file:///home/data/my_data/dev/dj-project/mp3-tag-json/data/mp3/new01/Norah%20Jones%20-%20Don't%20Know%20Why.mp3"
        }
        type="audio/mpeg"
      />
      Your browser does not support the audio element.
    </audio>
  );
}
