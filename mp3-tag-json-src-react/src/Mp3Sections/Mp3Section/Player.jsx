import { useEffect, useRef } from "react";
export function Player(props) {
  return (
    <audio controls style={{ width: "100%" }}>
      <source src={props.audioUrl} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
}
