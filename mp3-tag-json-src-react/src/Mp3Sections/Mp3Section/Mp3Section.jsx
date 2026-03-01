import { useEffect, useRef, useState } from "react";
import { InfoHeader } from "./InfoHeader";
import styles from "./mp3Section.module.css"; // Import the CSS module

import { Player } from "./Player";
import * as utils from "./utils";
import * as audioUtils from "./audioUtils";
import { useMp3SectionCommand } from "./hooks/useMp3SectionCommand";

export function Mp3Section(props) {
  const mp3SectionRef = useRef(null);
  const audioRef = useRef(null);

  const latestPropsRef = useRef(props);

  useEffect(() => {
    // Update the ref whenever props change
    latestPropsRef.current = props;
  }, [props]); // This hook keeps the ref current

  const { COMMAND_PLAY_PAUSE, COMMAND_SKIP_BACKWARD, COMMAND_SKIP_FORWARD } =
    useMp3SectionCommand(mp3SectionRef, handleCommand);

  const { mp3RelativePath } = props.mp3TagJson;

  const audioUrl = utils.getAudioUrl(mp3RelativePath);

  useEffect(() => {
    const isNeedToSelected = props.selectedIndex == props.index;
    if (isNeedToSelected) {
      handleSelect(mp3SectionRef);
    }
  }, [props.selectedIndex]);

  useEffect(() => {
    const isNeedToPause = props.playingIndex != props.index;
    if (isNeedToPause) {
      const audio = audioRef.current;
      audioUtils.pause(audio);
    }
  }, [props.playingIndex]);

  function handleCommand(command) {
    const lastestProps = latestPropsRef.current;
    const isPlayingIndex = lastestProps.playingIndex == lastestProps.index;
    console.log("isPlayingIndex", isPlayingIndex);
    console.log(
      "props.playingIndex , props.index",
      lastestProps.playingIndex,
      lastestProps.index
    );
    const audio = audioRef.current;
    if (command === COMMAND_PLAY_PAUSE) {
      const isPlaying = audioUtils.tooglePlayPause(audio);
      if (isPlaying) {
        lastestProps.onPlay(props.index);
      }
    } else if (command === COMMAND_SKIP_FORWARD && isPlayingIndex) {
      audioUtils.skipForward(audio);
    } else if (command === COMMAND_SKIP_BACKWARD && isPlayingIndex) {
      audioUtils.skipBackward(audio);
    }
  }

  function handleSelect(mp3SectionRef) {
    if (mp3SectionRef.current) {
      mp3SectionRef.current.focus(); //
    }
  }

  const isPlayingIndex = props.playingIndex == props.index;

  return (
    <div
      ref={mp3SectionRef}
      onClick={() => props.onClick(props.index)}
      tabIndex="0"
      style={{}}
      className={`${styles.focusableDiv}`}
    >
      <div inert={true}>
        <InfoHeader mp3TagJson={props.mp3TagJson} />
        <Player
          ref={audioRef}
          isPlayingIndex={isPlayingIndex}
          audioUrl={audioUrl}
        />
      </div>
    </div>
  );
}
