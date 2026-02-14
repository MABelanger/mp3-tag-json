import { useEffect, useRef } from "react";
import { InfoHeader } from "./InfoHeader";
import styles from "./mp3Section.module.css"; // Import the CSS module

import { Player } from "./Player";

import * as utils from "./utils";

export function Mp3Section(props) {
  const { mp3RelativePath } = props.mp3TagJson;

  const audioUrl = utils.getAudioUrl(mp3RelativePath);

  const mp3SectionRef = useRef(null);

  useEffect(() => {
    if (mp3SectionRef.current) {
      mp3SectionRef.current.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (mp3SectionRef.current) {
        mp3SectionRef.current.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [mp3SectionRef]);

  function handleKeyDown(event) {
    console.log("bibi");
    if (event.key === " ") {
      event.preventDefault(); // Prevent page scrolling
      const audio = mp3SectionRef.current;
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  }

  function handleClickDiv() {
    console.log("click");
    // Access the DOM node and call the native focus() method
    if (mp3SectionRef.current) {
      mp3SectionRef.current.focus(); //
    }
  }

  return (
    <div
      ref={mp3SectionRef}
      onClick={handleClickDiv}
      tabIndex="0"
      //onKeyDown={handleKeyDown}

      className={`${styles.focusableDiv}`}
    >
      <div>
        <InfoHeader mp3TagJson={props.mp3TagJson} />
        <Player audioUrl={audioUrl} />
      </div>
    </div>
  );
}
