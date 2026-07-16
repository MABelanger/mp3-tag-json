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
  sidebar: {
    width: "320px",
    backgroundColor: "#0f172a",
    color: "#f8fafc",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    borderRight: "1px solid #1e293b",
  },
  sidebarTitle: { margin: "0 0 15px 0", fontSize: "20px", fontWeight: "bold" },
  scanBtn: {
    padding: "10px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
  },
  statusBox: {
    margin: "10px 0",
    fontSize: "11px",
    color: "#94a3b8",
    fontStyle: "italic",
    wordBreak: "break-all",
  },
  trackListContainer: {
    flex: 1,
    overflowY: "auto",
    marginTop: "10px",
    paddingRight: "4px",
  },
  trackRow: {
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer",
    marginBottom: "6px",
    transition: "background-color 0.2s",
    userSelect: "none",
  },
  trackName: {
    fontSize: "13px",
    fontWeight: "500",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  trackSubtext: {
    fontSize: "11px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginTop: "2px",
  },
  mainPanel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  workspaceDisplay: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px",
  },
  emptyState: { textAlign: "center", color: "#64748b", maxWidth: "400px" },
  nowPlayingCard: { textAlign: "center", animation: "fadeIn 0.5s ease" },
  vinylIcon: { fontSize: "80px", animation: "spin 4s linear infinite" },
};
