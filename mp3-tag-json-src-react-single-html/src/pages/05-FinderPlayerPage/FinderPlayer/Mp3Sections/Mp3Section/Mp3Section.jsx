import React, { useState, useEffect, useSyncExternalStore } from "react";
import { InfoHeader } from "./InfoHeader";
import styles from "./mp3Section.module.css";
import { Player } from "./Player";
import * as utils from "./utils";
import { UseMp3Section } from "./hooks/UseMp3Section";
import { finderStore } from "../../hooks/finderStore"; // Ensure correct relative path

function Mp3SectionComponent(props) {
  const { index, result, dirRootHandle } = props;

  // 1. Compute primitive boolean states natively outside the parent rendering chain.
  // Unaffected rows calculate false === false and completely skip updating.
  const isActive = useSyncExternalStore(
    finderStore.subscribe,
    () => finderStore.getSelectedIndex() === index
  );

  const isPlaying = useSyncExternalStore(
    finderStore.subscribe,
    () => finderStore.getPlayingIndex() === index
  );

  // Map setters directly to your store configuration triggers
  const setSelectedIndex = finderStore.setSelectedIndex.bind(finderStore);
  const setPlayingIndex = finderStore.setPlayingIndex.bind(finderStore);

  // Sync internal hooks seamlessly with the store parameters
  const { mp3SectionRef, audioRef } = UseMp3Section(
    index,
    setPlayingIndex,
    isActive ? index : -1,
    isPlaying ? index : -1
  );

  console.log("DOM execution painting for index position:", index);

  const { mp3Handle, mp3Path } = result;
  const [audioUrl, setAudioUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadedPath, setLoadedPath] = useState(null);

  useEffect(() => {
    if (mp3Path === loadedPath) return;

    let active = true;
    setIsLoading(true);

    async function fetchAudioUrl() {
      try {
        const url = await utils.getAudioUrl(mp3Handle, mp3Path);
        if (active) {
          setAudioUrl(url);
          setLoadedPath(mp3Path);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching audio URL:", error);
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
  }, [mp3Handle, mp3Path, loadedPath]);

  return (
    <div
      ref={mp3SectionRef}
      onClick={() => setSelectedIndex(index)}
      tabIndex="-1"
      className={`${styles.focusableDiv} ${isActive ? styles.selectedRow : ""}`}
    >
      {isLoading ? (
        <div className={styles.loadingPlaceholder}>Loading audio track...</div>
      ) : (
        <div inert={true}>
          <InfoHeader result={result} audioUrl={audioUrl} />
          <Player ref={audioRef} isPlayingIndex={true} audioUrl={audioUrl} />
        </div>
      )}
    </div>
  );
}

export const Mp3Section = React.memo(
  Mp3SectionComponent,
  (prevProps, nextProps) => {
    return prevProps.result.mp3Path === nextProps.result.mp3Path;
  }
);
