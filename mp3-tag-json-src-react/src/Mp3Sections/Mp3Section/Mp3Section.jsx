import { useEffect, useRef } from "react";
import { InfoHeader } from "./InfoHeader";
import styles from "./mp3Section.module.css"; // Import the CSS module

import { Player } from "./Player";
import * as utils from "./utils";

const PLAY_PAUSE_KEY = " ";

export function Mp3Section(props) {
  const mp3SectionRef = useRef(null);
  const audioRef = useRef(null);

  const { mp3RelativePath } = props.mp3TagJson;
  const audioUrl = utils.getAudioUrl(mp3RelativePath);

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

  useEffect(() => {
    console.log(
      `props.selectedIndex ${props.selectedIndex} == props.index ${props.index}`
    );
    if (props.selectedIndex == props.index) {
      if (mp3SectionRef.current) {
        mp3SectionRef.current.focus(); //
      }
    }
  }, [props.selectedIndex]);

  function handleKeyDown(event) {
    event.preventDefault(); // Prevent page scrolling
    const audio = audioRef.current;

    if (event.key === PLAY_PAUSE_KEY) {
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
      style={{}}
      className={`${styles.focusableDiv}`}
    >
      <div inert={true}>
        <InfoHeader mp3TagJson={props.mp3TagJson} />
        <Player ref={audioRef} audioUrl={audioUrl} />
      </div>
    </div>
  );
}
