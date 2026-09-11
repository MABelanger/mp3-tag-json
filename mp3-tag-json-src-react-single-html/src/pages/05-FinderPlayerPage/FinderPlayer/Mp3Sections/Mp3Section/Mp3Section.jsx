import { InfoHeader } from "./InfoHeader";
import styles from "./mp3Section.module.css"; // Import the CSS module

import { Player } from "./Player";
import * as utils from "./utils";
import { UseMp3Section } from "./hooks/UseMp3Section";

import React, { useState, useEffect } from "react";

// async function getRelativePath(dirRootHandle, mp3Handle) {
//   const relativePathArray = await dirRootHandle.resolve(mp3Handle);
//   if (relativePathArray !== null) {
//     // .resolve() returns an array of folder/file names leading up to the file
//     const relativePath = relativePathArray.join("/");
//     console.log("relativePath", relativePath); // Output: "music/rock/audio.mp3"
//     return relativePath;

//     // Now you can easily strip extensions or manipulate this relative string path!
//   }
// }
export function Mp3Section(props) {
  const { mp3SectionRef, audioRef } = UseMp3Section(
    props.index,
    props.onPlay,
    props.selectedIndex,
    props.playingIndex
  );

  console.log("props.result", props.result);
  const { mp3Handle, mp3Path } = props.result;
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
        const url = await utils.getAudioUrl(mp3Handle, mp3Path);

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

  console.log("mp3Path3", mp3Path);
  return (
    <div
      ref={mp3SectionRef}
      onClick={props.onClick}
      tabIndex="0"
      style={{}}
      className={`${styles.focusableDiv}`}
    >
      {isLoading ? (
        <div className={styles.loadingPlaceholder}>Loading audio track...</div>
      ) : (
        <div inert={true}>
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

//export const Mp3Section = React.memo(Mp3SectionComponent);
