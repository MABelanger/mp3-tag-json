import { InfoHeader } from "./InfoHeader";
import styles from "./mp3Section.module.css"; // Import the CSS module

import { Player } from "./Player";
import * as utils from "./utils";
import { UseMp3Section } from "./hooks/UseMp3Section";

import React, { useState, useEffect } from "react";

export function Mp3Section(props) {
  const { mp3SectionRef, audioRef } = UseMp3Section(
    props.index,
    props.onPlay,
    props.selectedIndex,
    props.playingIndex
  );

  console.log("props.result", props.result);
  const { mp3Handle, path } = props.result;
  const isPlayingIndex = props.playingIndex == props.index;

  // 1. Initialize state for both the audio URL and the loading status
  const [audioUrl, setAudioUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 2. Fetch the audioUrl asynchronously when the mp3Handle changes
  useEffect(() => {
    let active = true;
    setIsLoading(true); // Reset loading state when mp3Handle changes

    async function fetchAudioUrl() {
      try {
        const url = await utils.getAudioUrl(mp3Handle);
        console.log("url", url);
        if (active) {
          setAudioUrl(url);
          setIsLoading(false); // Finished loading successfully
        }
      } catch (error) {
        console.error("Error fetching audio URL in Mp3Section:", error);
        if (active) {
          setIsLoading(false); // Stop loading even if it fails
        }
      }
    }

    if (mp3Handle) {
      fetchAudioUrl();
    } else {
      setIsLoading(false); // No mp3Handle to load
    }

    return () => {
      active = false;
    };
  }, [mp3Handle]);

  return (
    <div
      ref={mp3SectionRef}
      onClick={props.onClick}
      tabIndex="0"
      style={{}}
      className={`${styles.focusableDiv}`}
    >
      <div inert={true}>
        {/* <InfoHeader path={path} audioUrl={audioUrl} /> */}

        {/* 3. Use the isLoading flag to conditionally render the player or a placeholder */}
        {isLoading ? (
          <div className={styles.loadingPlaceholder}>
            Loading audio track...
          </div>
        ) : (
          <Player
            ref={audioRef}
            isPlayingIndex={isPlayingIndex}
            audioUrl={audioUrl}
          />
        )}
      </div>
    </div>
  );
}
