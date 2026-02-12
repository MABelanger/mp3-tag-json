import { useEffect, useRef } from "react";
import { AudioMetadataReader } from "./AudioMetadataReader";
import { Labels } from "./Labels";

export function Player(props) {
  const { mp3RelativePath } = props.mp3TagJson;
  const fileName = mp3RelativePath.split("/").pop();
  const titleName = fileName.slice(0, -4);

  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [audioRef]);

  const handleKeyDown = (event) => {
    console.log("bibi");
    if (event.key === " ") {
      event.preventDefault(); // Prevent page scrolling
      const audio = audioRef.current;
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  };

  return (
    <div
      ref={audioRef}
      tabIndex="0"
      onKeyDown={handleKeyDown}
      style={{ paddingBottom: "40px", width: "100%" }}
    >
      <AudioMetadataReader audioUrl={"/api/" + mp3RelativePath} />
      {titleName}
      <audio controls style={{ width: "100%" }}>
        <source src={"/api/" + mp3RelativePath} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <Labels mp3TagJson={props.mp3TagJson} />
    </div>
  );
}
