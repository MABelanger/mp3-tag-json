export function AudioHtmlPlayer(props) {
  return (
    <div style={styles.bottomPlaybackDock}>
      <audio
        ref={props.ref}
        src={props.audioSrc}
        controls
        style={styles.globalNativeController}
      />
    </div>
  );
}

const styles = {
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
