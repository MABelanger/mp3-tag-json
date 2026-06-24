import React, { useState } from "react";

export default function DeepDirectoryScanner() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Ready to scan.");

  // The core recursive scanner function
  const scanFolderRecursively = async (directoryHandle, currentPath = "") => {
    let results = [];

    for await (const entry of directoryHandle.values()) {
      // Construct the relative path (e.g., "Config/SubFolder/settings.json")
      const relativePath = currentPath
        ? `${currentPath}/${entry.name}`
        : entry.name;

      if (entry.kind === "file") {
        const fileData = await entry.getFile();
        let jsonContent = null;

        // If the file extension matches .json, read and parse it immediately
        if (fileData.name.toLowerCase().endsWith(".json")) {
          try {
            const text = await fileData.text();
            jsonContent = JSON.parse(text);
          } catch (err) {
            jsonContent = { error: `Failed to parse JSON: ${err.message}` };
          }
        }

        // Store the file information object
        results.push({
          name: entry.name,
          path: relativePath,
          isJson: fileData.name.toLowerCase().endsWith(".json"),
          content: jsonContent,
        });
      } else if (entry.kind === "directory") {
        // Recurse deeper into the sub-directory
        const deepFiles = await scanFolderRecursively(entry, relativePath);
        results = results.concat(deepFiles);
      }
    }

    return results;
  };

  const handleScanClick = async () => {
    try {
      setLoading(true);
      setStatus("Opening system picker native dialog...");

      const rootHandle = await window.showDirectoryPicker();
      setStatus(`Scanning deep folder structure for: "${rootHandle.name}"...`);

      const allDiscoveredFiles = await scanFolderRecursively(rootHandle);

      setFiles(allDiscoveredFiles);
      setStatus(
        `Scan complete! Discovered ${allDiscoveredFiles.length} total files.`
      );
    } catch (error) {
      console.error(error);
      setStatus(`Scan cancelled or rejected: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Recursive File Discovery & JSON Reader</h2>
      <p style={styles.statusMsg}>
        <strong>Status:</strong> {status}
      </p>

      <button onClick={handleScanClick} disabled={loading} style={styles.btn}>
        {loading
          ? "Reading Folder Structure..."
          : "📁 Select Folder to Deep Scan"}
      </button>

      <div style={{ marginTop: "20px" }}>
        {files.map((file, idx) => (
          <div key={idx} style={styles.fileCard}>
            <div style={styles.filePath}>
              {file.isJson ? "📄 [JSON File] " : "📝 [File] "} {file.path}
            </div>

            {file.isJson && file.content && (
              <pre style={styles.jsonBox}>
                {JSON.stringify(file.content, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Scoped inline styles for complete styling autonomy
const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    fontFamily: "system-ui, -apple-system, sans-serif",
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
  filePath: {
    fontFamily: "monospace",
    fontWeight: "bold",
    color: "#1e293b",
  },
  jsonBox: {
    marginTop: "10px",
    background: "#0f172a",
    color: "#38bdf8",
    padding: "14px",
    borderRadius: "6px",
    overflowX: "auto",
    fontFamily: "'Courier New', monospace",
    fontSize: "13px",
    whiteApace: "pre-wrap",
  },
  statusMsg: {
    margin: "15px 0",
    fontWeight: "500",
    color: "#64748b",
  },
};
