import { useCallback, useEffect, useRef, useState } from "react";
import { Mp3Section } from "./Mp3Section";

import { useLocalFileFlag } from "./hooks/useLocalFileFlag";
import { getFilePath } from "./utils/fileUtils";

export function App(props) {
  const [playingIndex, setPlayingIndex] = useState(0);
  const { isLocalFileFlag } = useLocalFileFlag();

  console.log("isLocalFileFlag", isLocalFileFlag);

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

  const srcPath = getFilePath(
    "/data/mp3/new01/Norah Jones - Don't Know Why.mp3"
  );

  console.log("srcPath", srcPath);
  return (
    <audio controls>
      <source src={srcPath} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
}
