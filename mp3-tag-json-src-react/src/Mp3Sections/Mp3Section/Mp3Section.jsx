import { useEffect, useRef } from "react";
import { InfoHeader } from "./InfoHeader";
import styles from "./mp3Section.module.css"; // Import the CSS module

import { Player } from "./Player";

import * as utils from "./utils";

export function Mp3Section(props) {
  const { mp3RelativePath } = props.mp3TagJson;

  const audioUrl = utils.getAudioUrl(mp3RelativePath);

  const mp3SectionRef = useRef(null);
  const audioRef = useRef(null);

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

  // useEffect(() => {
  //   // Access the child's DOM node or exposed methods here after the component mounts
  //   if (audioRef.current) {
  //     audioRef.current.play(); // Example: calling a method on the child's element
  //   }
  // }, []);

  function handleKeyDown(event) {
    console.log("bibi");
    if (event.key === " ") {
      event.preventDefault(); // Prevent page scrolling
      const audio = audioRef.current;
      //audio.play();
      console.log(audio.paused);
      if (audio.paused) {
        console.log("play");
        audio.play();
      } else {
        console.log("pause");
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
      onKeyDown={handleKeyDown}
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
