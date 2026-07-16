export function LeftSideBar(props) {
  {
    /* LEFT SIDEBAR: Library & Queue Listings */
  }

  return (
    <div style={styles.sidebar}>
      <h3 style={styles.sidebarTitle}>🎵 My Music App</h3>

      <div style={styles.trackListContainer}>
        {props.tracks.map((track, i) => (
          <div
            key={i}
            onClick={() => props.onPlayTrack(i)}
            style={{
              ...styles.trackRow,
              backgroundColor:
                props.currentTrackIndex === i ? "#3b82f6" : "transparent",
              color: props.currentTrackIndex === i ? "#ffffff" : "#f1f5f9",
            }}
          >
            <div style={styles.trackName} title={track.path}>
              {track.name}
            </div>
            <div
              style={{
                ...styles.trackSubtext,
                color: props.currentTrackIndex === i ? "#bfdbfe" : "#94a3b8",
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
  );
}

const styles = {
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
};
