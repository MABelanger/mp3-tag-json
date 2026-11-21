import { forwardRef, useEffect, useRef } from "react";

export const Player = forwardRef((props, ref) => {
  const handleStop = () => {
    if (ref.current) {
      ref.current.pause();
      ref.current.currentTime = 0; // Rewinds to the beginning
    }
  };

  if (props.isPlayingIndex) {
    handleStop();
  }

  return (
    <audio
      controls
      ref={ref}
      style={{
        display: props.isPlayingIndex ? "inherit" : "none",
        width: "100%",
        filter: "invert(100%) hue-rotate(180deg)",
        WebkitFilter: "invert(100%) hue-rotate(180deg)",
      }}
    >
      <source src={props.audioUrl} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
});
