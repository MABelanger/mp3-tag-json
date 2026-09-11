import React, { useState, useEffect } from "react";
import { InfoHeader } from "./InfoHeader";
import styles from "./mp3Section.module.css";
import { Player } from "./Player";
import * as utils from "./utils";
import { UseMp3Section } from "./hooks/UseMp3Section";

export function Mp3SectionComponent(props) {
  console.log("NEW");
  const { mp3SectionRef, audioRef } = UseMp3Section(
    props.index,
    props.onPlay,
    props.selectedIndex,
    props.playingIndex
  );

  console.log("Rendering Row Index:", props.index); // Will now ONLY fire for target impacted index positions!

  const { mp3Handle, mp3Path } = props.result;
  const isPlayingIndex = props.playingIndex === props.index;
  const [audioUrl, setAudioUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    async function fetchAudioUrl() {
      try {
        const url = await utils.getAudioUrl(mp3Handle);
        if (active) {
          setAudioUrl(url);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching audio URL in Mp3Section:", error);
        if (active) setIsLoading(false);
      }
    }

    if (mp3Handle) {
      fetchAudioUrl();
    } else {
      setIsLoading(false);
    }

    return () => {
      active = false;
    };
  }, [mp3Handle]);

  return (
    <div
      ref={mp3SectionRef}
      onClick={props.onClick}
      tabIndex="-1" // Switch to -1 to let scroller capture main keyboard focus instead
      className={`${styles.focusableDiv}`}
    >
      {isLoading ? (
        <div className={styles.loadingPlaceholder}>Loading audio track...</div>
      ) : (
        <div inert={true.toString()}>
          {" "}
          {/* Safe DOM boolean evaluation mapping string formatting */}
          <InfoHeader result={props.result} audioUrl={audioUrl} />
          <Player
            ref={audioRef}
            isPlayingIndex={isPlayingIndex}
            audioUrl={audioUrl}
          />
        </div>
      )}
    </div>
  );
}

// 4. ADVANCED MEMO RULE: Only let the component update if its selection/play status actively changed
export const Mp3Section = React.memo(
  Mp3SectionComponent,
  (prevProps, nextProps) => {
    const wasSelected = prevProps.selectedIndex === prevProps.index;
    const isSelected = nextProps.selectedIndex === nextProps.index;

    const wasPlaying = prevProps.playingIndex === prevProps.index;
    const isPlaying = nextProps.playingIndex === nextProps.index;

    // If selection context state didn't flip relative to this explicit cell index, skip render processing!
    return (
      wasSelected === isSelected &&
      wasPlaying === isPlaying &&
      prevProps.result.id === nextProps.result.id
    );
  }
);
