import React, { useState, useRef, useEffect } from "react";

export function DirectoryPlayer() {
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [activeAudioSrc, setActiveAudioSrc] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("No library folder loaded.");

  const audioPlayerRef = useRef(null);

  // 1. Recursive scan that flags MP3 metadata cleanly without eating RAM
  const scanFolderForAudio = async (directoryHandle, currentPath = "") => {
    let results = [];

    for await (const entry of directoryHandle.values()) {
      const relativePath = currentPath
        ? `${currentPath}/${entry.name}`
        : entry.name;
      const lowerName = entry.name.toLowerCase();

      if (entry.kind === "file" && lowerName.endsWith(".mp3")) {
        results.push({
          name: entry.name,
          path: relativePath,
          handle: entry, // Keep the raw handle reference to pull file bytes lazily later
        });
      } else if (entry.kind === "directory") {
        const deepTracks = await scanFolderForAudio(entry, relativePath);
        results = results.concat(deepTracks);
      }
    }
    return results;
  };

  const handleLoadLibrary = async () => {
    try {
      setLoading(true);
      setStatus("Opening browser folder picker...");
      const rootHandle = await window.showDirectoryPicker();

      setStatus("Scanning directories for audio assets...");
      const discoveredTracks = await scanFolderForAudio(rootHandle);

      setTracks(discoveredTracks);
      setCurrentTrackIndex(null);
      setActiveAudioSrc("");
      setStatus(`Successfully indexed ${discoveredTracks.length} tracks.`);
    } catch (error) {
      console.error(error);
      setStatus(`Library load rejected: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 2. Lazy memory generation strategy triggered on user click or track progression
  const playTrack = async (index) => {
    if (index < 0 || index >= tracks.length) return;

    try {
      // Free memory allocation belonging to the prior track
      if (activeAudioSrc) {
        URL.revokeObjectURL(activeAudioSrc);
      }

      const targetTrack = tracks[index];
      const fileData = await targetTrack.handle.getFile();

      // Generate a temporary execution stream link for exactly one file
      const dynamicUrl = URL.createObjectURL(fileData);

      setCurrentTrackIndex(index);
      setActiveAudioSrc(dynamicUrl);
    } catch (err) {
      setStatus(`Failed to read track file: ${err.message}`);
    }
  };

  // 3. Sequential automation engine
  const handleTrackEnded = () => {
    if (currentTrackIndex !== null && currentTrackIndex + 1 < tracks.length) {
      // Advance execution index count step by one forward
      playTrack(currentTrackIndex + 1);
    } else {
      setStatus("Playlist queue finished.");
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

  const activeTrack =
    currentTrackIndex !== null ? tracks[currentTrackIndex] : null;

  return (
    <div style={styles.appLayout}>
      {/* LEFT SIDEBAR: Library & Queue Listings */}
      <div style={styles.sidebar}>
        <h3 style={styles.sidebarTitle}>🎵 My Music App</h3>
        <button
          onClick={handleLoadLibrary}
          disabled={loading}
          style={styles.scanBtn}
        >
          {loading ? "Indexing Files..." : "📁 Load Music Directory"}
        </button>
        <div style={styles.statusBox}>{status}</div>

        <div style={styles.trackListContainer}>
          {tracks.map((track, i) => (
            <div
              key={i}
              onClick={() => playTrack(i)}
              style={{
                ...styles.trackRow,
                backgroundColor:
                  currentTrackIndex === i ? "#3b82f6" : "transparent",
                color: currentTrackIndex === i ? "#ffffff" : "#f1f5f9",
              }}
            >
              <div style={styles.trackName} title={track.path}>
                {track.name}
              </div>
              <div
                style={{
                  ...styles.trackSubtext,
                  color: currentTrackIndex === i ? "#bfdbfe" : "#94a3b8",
                }}
              >
                {track.path.includes("/")
                  ? track.path.substring(0, track.path.lastIndexOf("/"))
                  : "Root"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN LAYOUT CONTENT PANELS & INTEGRATED MEDIA DECK BAR */}
      <div style={styles.mainPanel}>
        <div style={styles.workspaceDisplay}>
          {activeTrack ? (
            <div style={styles.nowPlayingCard}>
              <div style={styles.vinylIcon}>💿</div>
              <h2 style={{ margin: "10px 0 5px 0" }}>{activeTrack.name}</h2>
              <p
                style={{ color: "#64748b", margin: 0, fontFamily: "monospace" }}
              >
                {activeTrack.path}
              </p>
            </div>
          ) : (
            <div style={styles.emptyState}>
              <h3>No Track Selected</h3>
              <p>
                Select a local media folder to sync files and build a dynamic
                queue structure.
              </p>
            </div>
          )}
        </div>

        {/* BOTTOM GLOBAL MEDIA REGULATION DOCKBAR CONTAINER */}
        <div style={styles.bottomPlaybackDock}>
          <audio
            ref={audioPlayerRef}
            src={activeAudioSrc}
            controls
            onEnded={handleTrackEnded}
            style={styles.globalNativeController}
          />
        </div>
      </div>
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
  bottomPlaybackDock: {
    height: "80px",
    backgroundColor: "#ffffff",
    borderTop: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 40px",
  },
  globalNativeController: { width: "100%", maxWidth: "700px" },
};
