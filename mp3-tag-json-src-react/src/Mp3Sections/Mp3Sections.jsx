import { useCallback, useEffect, useRef, useState } from "react";
import { useMp3SectionsCommand } from "./hooks/useMp3SectionsCommand";
import { Mp3Section } from "./Mp3Section";

export function Mp3Sections(props) {
  const numberOfSection = props.mp3TagJsons.length - 1;

  const [playingIndex, setplayingIndex] = useState(null);

  const { onKeyDown, selectedIndex, setSelectedIndex } =
    useMp3SectionsCommand(numberOfSection);

  function handlePlay(index) {
    setplayingIndex(index);
  }

  const mp3SectionsWrapperRef = useRef(null);

  function handleClickSection(index) {
    setSelectedIndex(index);
  }

  const mp3Sections = props.mp3TagJsons.map((mp3TagJson, i) => {
    return (
      <div key={i}>
        <Mp3Section
          index={i}
          selectedIndex={selectedIndex}
          onClick={handleClickSection}
          onPlay={handlePlay}
          playingIndex={playingIndex}
          mp3TagJson={mp3TagJson}
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
