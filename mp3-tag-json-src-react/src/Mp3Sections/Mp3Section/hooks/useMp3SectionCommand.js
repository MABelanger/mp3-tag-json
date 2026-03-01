import { useEffect, useState } from "react";
import {
  COMMAND_PLAY_PAUSE,
  COMMAND_SKIP_BACKWARD,
  COMMAND_SKIP_FORWARD,
} from "./commandConstant";

const PLAY_PAUSE_KEY = " ";
const SKIP_PLAY_FORWARD_KEY = "l";
const SKIP_PLAY_FORWARD_ARROW = "ArrowRight";
const SKIP_PLAY_BACKWARD_KEY = "h";
const SKIP_PLAY_BACKWARD_ARROW = "ArrowLeft";

export function useMp3SectionCommand(mp3SectionRef, onCommand) {
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

  function getCommand(key) {
    const isKeyPlayPause = key === PLAY_PAUSE_KEY;
    if (isKeyPlayPause) {
      return COMMAND_PLAY_PAUSE;
    }

    const isKeySkipForward =
      key === SKIP_PLAY_FORWARD_KEY || key === SKIP_PLAY_FORWARD_ARROW;

    if (isKeySkipForward) {
      return COMMAND_SKIP_FORWARD;
    }

    const isKeySkipBackward =
      key === SKIP_PLAY_BACKWARD_KEY || key === SKIP_PLAY_BACKWARD_ARROW;

    if (isKeySkipBackward) {
      return COMMAND_SKIP_BACKWARD;
    }

    return null;
  }

  function handleKeyDown(event) {
    event.preventDefault(); // Prevent page scrolling
    const command = getCommand(event.key);
    onCommand(command);
  }

  return {
    COMMAND_PLAY_PAUSE,
    COMMAND_SKIP_BACKWARD,
    COMMAND_SKIP_FORWARD,
  };
}
