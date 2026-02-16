import { useCallback, useEffect, useRef, useState } from "react";
import { Mp3Section } from "./Mp3Section";

export function Mp3Sections(props) {
  const KEY_DOWN = "k";
  const KEY_UP = "j";
  const numberOfSection = props.mp3TagJsons.length - 1;
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleKeyDown = (event) => {
    event.preventDefault(); // Prevent page scrolling
    if (event.key === KEY_UP) {
      setSelectedIndex((prev) => {
        if (prev < numberOfSection) {
          const current = prev + 1;
          return current;
        }
        return prev;
      });
    } else if (event.key === KEY_DOWN) {
      setSelectedIndex((prev) => {
        const current = prev - 1;
        if (prev > 0) {
          return current;
        }
        return prev;
      });
    }
    console.log("handleKeyDown selectedIndex :", selectedIndex);
  };

  const mp3SectionsWrapperRef = useRef(null);
  // useEffect(() => {
  //   if (mp3SectionsWrapperRef.current) {
  //     mp3SectionsWrapperRef.current.addEventListener("keydown", handleKeyDown);
  //   }

  //   return () => {
  //     if (mp3SectionsWrapperRef.current) {
  //       mp3SectionsWrapperRef.current.removeEventListener(
  //         "keydown",
  //         handleKeyDown
  //       );
  //     }
  //   };
  // }, [mp3SectionsWrapperRef]);

  const mp3Sections = props.mp3TagJsons.map((mp3TagJson, i) => {
    const isSelected = i == selectedIndex;
    console.log(`selectedIndex: ${selectedIndex}, i ${i} : ${isSelected}`);

    return (
      <div key={i}>
        <Mp3Section
          index={i}
          selectedIndex={selectedIndex}
          mp3TagJson={mp3TagJson}
        />
      </div>
    );
  });

  return (
    <div onKeyDown={handleKeyDown} ref={mp3SectionsWrapperRef}>
      {mp3Sections}
    </div>
  );
}
