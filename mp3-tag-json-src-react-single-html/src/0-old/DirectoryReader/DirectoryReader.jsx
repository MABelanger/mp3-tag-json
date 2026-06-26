import React, { useState } from "react";

export default function MediaDirectoryScanner() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Ready to scan.");

  // The recursive scanner function
  const scanFolderRecursively = async (directoryHandle, currentPath = "") => {
    let results = [];

    for await (const entry of directoryHandle.values()) {
      const relativePath = currentPath
        ? `${currentPath}/${entry.name}`
        : entry.name;
      const lowerName = entry.name.toLowerCase();

      if (entry.kind === "file") {
        const fileData = await entry.getFile();
        let jsonContent = null;
        let audioUrl = null;

        // 1. Process JSON files
        if (lowerName.endsWith(".json")) {
          try {
            const text = await fileData.text();
            jsonContent = JSON.parse(text);
          } catch (err) {
            jsonContent = { error: `Failed to parse JSON: ${err.message}` };
          }
        }

        // 2. Process MP3 files -> Create a local memory object URL
        if (lowerName.endsWith(".mp3")) {
          audioUrl = URL.createObjectURL(fileData);
        }

        results.push({
          name: entry.name,
          path: relativePath,
          isJson: lowerName.endsWith(".json"),
          isMp3: lowerName.endsWith(".mp3"),
          content: jsonContent,
          src: audioUrl, // Pass the generated blob URL to the player
        });
      } else if (entry.kind === "directory") {
        const deepFiles = await scanFolderRecursively(entry, relativePath);
        results = results.concat(deepFiles);
      }
    }

    return results;
  };

  const handleScanClick = async () => {
    try {
      setLoading(true);
      setStatus("Opening system picker...");

      const rootHandle = await window.showDirectoryPicker();
      setStatus(`Scanning: "${rootHandle.name}"...`);

      const allDiscoveredFiles = await scanFolderRecursively(rootHandle);

      setFiles(allDiscoveredFiles);
      setStatus(`Scan complete! Loaded ${allDiscoveredFiles.length} files.`);
    } catch (error) {
      console.error(error);
      setStatus(`Scan failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Recursive Folder Media Player & Reader</h2>
      <p style={styles.statusMsg}>
        <strong>Status:</strong> {status}
      </p>

      <button onClick={handleScanClick} disabled={loading} style={styles.btn}>
        {loading ? "Reading Media..." : "📁 Select Folder to Deep Scan"}
      </button>

      <div style={{ marginTop: "20px" }}>
        {files.map((file, idx) => (
          <div key={idx} style={styles.fileCard}>
            <div style={styles.filePath}>
              {file.isJson && "📄 [JSON File] "}
              {file.isMp3 && "🎵 [Audio File] "}
              {!file.isJson && !file.isMp3 && "📝 [File] "}
              {file.path}
            </div>

            {/* Render interactive JSON code box */}
            {file.isJson && file.content && (
              <pre style={styles.jsonBox}>
                {JSON.stringify(file.content, null, 2)}
              </pre>
            )}

            {/* Render dynamic HTML5 native audio controller */}
            {file.isMp3 && file.src && (
              <div style={styles.audioWrapper}>
                <audio controls src={file.src} style={styles.audioPlayer}>
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    fontFamily: "system-ui, sans-serif",
    color: "#0f172a",
    padding: "20px",
  },
  btn: {
    padding: "12px 24px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
  },
  fileCard: {
    background: "white",
    marginTop: "15px",
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e2e8f0",
  },
  filePath: { fontFamily: "monospace", fontWeight: "bold", color: "#1e293b" },
  jsonBox: {
    marginTop: "10px",
    background: "#0f172a",
    color: "#38bdf8",
    padding: "14px",
    borderRadius: "6px",
    overflowX: "auto",
    fontFamily: "monospace",
    fontSize: "13px",
    whiteSpace: "pre-wrap",
  },
  audioWrapper: { marginTop: "12px" },
  audioPlayer: { width: "100%", maxHeight: "40px" },
  statusMsg: { margin: "15px 0", fontWeight: "500", color: "#64748b" },
};
