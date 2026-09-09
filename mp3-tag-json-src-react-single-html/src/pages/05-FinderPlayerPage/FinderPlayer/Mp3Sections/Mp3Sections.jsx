import { useCallback, useEffect, useRef, useState } from "react";
import { useMp3SectionsCommand } from "./hooks/useMp3SectionsCommand";
import { Mp3Section } from "./Mp3Section";

/*
        mp3Tracks={props.mp3Tracks}
        dirRootHandle={props.dirRootHandle}
*/
export function Mp3Sections(props) {
  const numberOfSection = props.results.length - 1;

  const [playingIndex, setPlayingIndex] = useState(0);

  const { onKeyDown, selectedIndex, setSelectedIndex } =
    useMp3SectionsCommand(numberOfSection);

  const mp3SectionsWrapperRef = useRef(null);

  const mp3Sections = props.results.map((result, i) => {
    return (
      <div key={i}>
        <Mp3Section
          index={i}
          selectedIndex={selectedIndex}
          onClick={() => setSelectedIndex(i)}
          onPlay={() => setPlayingIndex(i)}
          playingIndex={playingIndex}
          result={result}
        />
      </div>
    );
  });

  return (
    <div onKeyDown={onKeyDown} ref={mp3SectionsWrapperRef}>
      {mp3Sections}
    </div>
  );
}
