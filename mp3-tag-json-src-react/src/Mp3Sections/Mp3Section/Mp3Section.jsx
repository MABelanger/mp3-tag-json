import { useEffect, useRef } from "react";
import { AudioMetadataReader } from "./AudioMetadataReader";
import { Labels } from "./Labels";
import { Player } from "./Player";
import { Title } from "./Title";
import * as utils from "./utils";

export function Mp3Section(props) {
  const { mp3RelativePath } = props.mp3TagJson;
  const soundName = utils.getSoundName(mp3RelativePath);

  const mp3SectionRef = useRef(null);

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

  const handleKeyDown = (event) => {
    console.log("bibi");
    if (event.key === " ") {
      event.preventDefault(); // Prevent page scrolling
      const audio = mp3SectionRef.current;
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  };

  return (
    <div
      ref={mp3SectionRef}
      tabIndex="0"
      onKeyDown={handleKeyDown}
      style={{ paddingBottom: "40px", width: "100%" }}
    >
      <AudioMetadataReader audioUrl={"/api/" + mp3RelativePath} />
      <Title soundName={soundName} />
      <Player audioUrl={"/api/" + mp3RelativePath} />
      <Labels mp3TagJson={props.mp3TagJson} />
    </div>
  );
}
