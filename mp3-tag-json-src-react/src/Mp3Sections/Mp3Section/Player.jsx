import { forwardRef, useEffect, useRef } from "react";

export const Player = forwardRef((props, ref) => {
  return (
    <audio
      controls
      ref={ref}
      style={{
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
