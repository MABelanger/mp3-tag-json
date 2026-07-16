import { CoverArt } from "./CoverArt";
import { AudioHtmlPlayer } from "./AudioHtmlPlayer";
import { FormTagSection } from "./FormTagSection";
import TapTempo from "./TapTempo/TapTempo";

export function RightMainPanel(props) {
  {
    /* MAIN LAYOUT CONTENT PANELS & INTEGRATED MEDIA DECK BAR */
  }
  return (
    <div style={styles.mainPanel}>
      <div style={styles.statusBox}>{props.status}</div>
      <div style={styles.workspaceDisplay}>
        {props.activeTrack ? (
          <div style={styles.nowPlayingCard}>
            <h3 style={{ margin: "10px 0 5px 0" }}>{props.activeTrack.path}</h3>
            <div
              style={{
                color: "#64748b",
                margin: 0,
                fontFamily: "monospace",
              }}
            >
              <CoverArt audioUrl={props.activeAudioSrc} />
              <AudioHtmlPlayer
                ref={props.audioPlayerRef}
                audioSrc={props.activeAudioSrc}
              />
              <TapTempo />
              <FormTagSection
                mp3FilePath={props.activeTrack.path}
                jsonFilePath={props.activeTrack.path + ".json"}
                dirRootHandle={props.dirRootHandle}
              />
            </div>
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
    </div>
  );
}

const styles = {
  statusBox: {
    margin: "10px 0",
    fontSize: "11px",
    color: "#94a3b8",
    fontStyle: "italic",
    wordBreak: "break-all",
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
};
