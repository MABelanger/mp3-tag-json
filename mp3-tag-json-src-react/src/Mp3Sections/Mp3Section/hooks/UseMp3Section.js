import { useEffect, useRef } from "react";
import * as audioUtils from "./audioUtils";
import { useMp3SectionCommand } from "./useMp3SectionCommand";

export function UseMp3Section(index, onPlay, selectedIndex, playingIndex) {
  const mp3SectionRef = useRef(null);
  const audioRef = useRef(null);

  const playingIndexRef = useRef(playingIndex);

  const { COMMAND_PLAY_PAUSE, COMMAND_SKIP_BACKWARD, COMMAND_SKIP_FORWARD } =
    useMp3SectionCommand(mp3SectionRef, handleCommand);

  useEffect(() => {
    const isNeedToSelected = selectedIndex == index;
    if (isNeedToSelected) {
      handleSelect(mp3SectionRef);
    }
  }, [selectedIndex]);

  useEffect(() => {
    playingIndexRef.current = playingIndex;
    const isNeedToPause = playingIndex != index;
    if (isNeedToPause) {
      const audio = audioRef.current;

      audioUtils.pause(audio);
    }
  }, [playingIndex]);

  function handleCommand(command) {
    const isPlayingIndex = playingIndexRef.current == index;

    const audio = audioRef.current;
    if (command === COMMAND_PLAY_PAUSE) {
      const isPlaying = audioUtils.tooglePlayPause(audio);
      if (isPlaying) {
        onPlay();
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

  return {
    mp3SectionRef,
    audioRef,
  };
}
