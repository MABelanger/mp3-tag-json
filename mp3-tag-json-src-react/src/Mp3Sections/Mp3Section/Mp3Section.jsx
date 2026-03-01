import { useEffect, useRef } from "react";
import { InfoHeader } from "./InfoHeader";
import styles from "./mp3Section.module.css"; // Import the CSS module

import { Player } from "./Player";
import * as utils from "./utils";
import * as audioUtils from "./audioUtils";

import {
  COMMAND_PLAY_PAUSE,
  COMMAND_SKIP_BACKWARD,
  COMMAND_SKIP_FORWARD,
} from "./commandConstant";
import { useMp3SectionCommand } from "./useMp3SectionCommand";

export function Mp3Section(props) {
  const mp3SectionRef = useRef(null);
  const audioRef = useRef(null);

  useMp3SectionCommand(mp3SectionRef, handleCommand);

  const { mp3RelativePath } = props.mp3TagJson;
  const audioUrl = utils.getAudioUrl(mp3RelativePath);

  useEffect(() => {
    if (props.selectedIndex == props.index) {
      if (mp3SectionRef.current) {
        mp3SectionRef.current.focus(); //
      }
    }
  }, [props.selectedIndex]);

  useEffect(() => {
    if (props.playingIndex != props.index) {
      const audio = audioRef.current;
      audioUtils.pause(audio);
    }
  }, [props.playingIndex]);

  function handleCommand(command) {
    const audio = audioRef.current;
    if (command === COMMAND_PLAY_PAUSE) {
      audioUtils.tooglePlayPause(audio, () => {
        props.onPlay(props.index);
      });
    } else if (command === COMMAND_SKIP_FORWARD) {
      audioUtils.skipForward(audio);
    } else if (command === COMMAND_SKIP_BACKWARD) {
      audioUtils.skipBackward(audio);
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
