import React, { useState, useRef, useEffect } from "react";

import { LeftSideBar } from "./LeftSideBar";
import { RightMainPanel } from "./RightMainPanel";

export function PlayerWithCoverArt(props) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [activeAudioSrc, setActiveAudioSrc] = useState("");
  const [status, setStatus] = useState("");
  const audioPlayerRef = useRef(null);

  function initLibrary() {
    setCurrentTrackIndex(null);
    setActiveAudioSrc("");
  }

  // 2. Lazy memory generation strategy triggered on user click or track progression
  const handlePlayTrack = async (index) => {
    if (index < 0 || index >= props.tracks.length) return;

    try {
      // Free memory allocation belonging to the prior track
      if (activeAudioSrc) {
        URL.revokeObjectURL(activeAudioSrc);
      }

      const targetTrack = props.tracks[index];
      const fileData = await targetTrack.handle.getFile();

      // Generate a temporary execution stream link for exactly one file
      const dynamicUrl = URL.createObjectURL(fileData);

      setCurrentTrackIndex(index);
      setActiveAudioSrc(dynamicUrl);
    } catch (err) {
      console.log(err);
      setStatus(`Failed to read track file: ${err.message}`);
    }
  };

  // Auto-play trigger mechanism when active resource path changes
  useEffect(() => {
    if (activeAudioSrc && audioPlayerRef.current) {
      audioPlayerRef.current.play().catch((err) => {
        console.log(
          "Autoplay blocked by browser privacy. Click play manually.",
          err
        );
      });
    }
  }, [activeAudioSrc]);

  useEffect(() => {
    initLibrary();
  }, []);

  const activeTrack =
    currentTrackIndex !== null ? props.tracks[currentTrackIndex] : null;

  return (
    <div style={styles.appLayout}>
      <LeftSideBar
        currentTrackIndex={currentTrackIndex}
        tracks={props.tracks}
        onPlayTrack={handlePlayTrack}
      />

      <RightMainPanel
        status={status}
        activeTrack={activeTrack}
        activeAudioSrc={activeAudioSrc}
        audioPlayerRef={audioPlayerRef}
        dirRootHandle={props.dirRootHandle}
      />
    </div>
  );
}

const styles = {
  appLayout: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    backgroundColor: "#f8fafc",
    overflow: "hidden",
    fontFamily: "system-ui, sans-serif",
  },
};
