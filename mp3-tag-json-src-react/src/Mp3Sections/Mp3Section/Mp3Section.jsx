import { useEffect, useRef, useState } from "react";
import { InfoHeader } from "./InfoHeader";
import styles from "./mp3Section.module.css"; // Import the CSS module

import { Player } from "./Player";
import * as utils from "./utils";
import { UseMp3Section } from "./hooks/UseMp3Section";

export function Mp3Section(props) {
  const { mp3RelativePath } = props.mp3TagJson;

  const audioUrl = utils.getAudioUrl(mp3RelativePath);
  const isPlayingIndex = props.playingIndex == props.index;

  const { mp3SectionRef, audioRef } = UseMp3Section(
    props.index,
    props.onPlay,
    props.selectedIndex,
    props.playingIndex
  );

  return (
    <div
      ref={mp3SectionRef}
      onClick={props.onClick}
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
