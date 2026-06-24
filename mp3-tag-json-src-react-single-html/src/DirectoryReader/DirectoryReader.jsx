import React, { useState } from "react";

export default function DirectoryReader() {
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  const scanFolderRecursively = async (directoryHandle, currentPath = "") => {
    let fileList = [];

    for await (const entry of directoryHandle.values()) {
      // Combine names to track the folder structure (e.g., "Music/Rock")
      const relativePath = currentPath
        ? `${currentPath}/${entry.name}`
        : entry.name;

      if (entry.kind === "file") {
        const file = await entry.getFile();

        // If you want to read the raw text string inside the file:
        // const fileText = await file.text();

        // Push whatever string or object metadata you want to track
        fileList.push(relativePath);
      } else if (entry.kind === "directory") {
        // Pass the updated folder path down into the next deep layer
        const subFolderFiles = await scanFolderRecursively(entry, relativePath);

        // Merge the results of the subfolder into our main list
        fileList = fileList.concat(subFolderFiles);
      }
    }

    console.log("fileList", fileList);

    return fileList; // Returns a flat array of strings to the original caller
  };

  const handleOpenFolder = async () => {
    try {
      setLoading(true);
      // 1. Trigger the native OS directory select interface
      const dirHandle = await window.showDirectoryPicker();
      const dirHandleRecursive = await scanFolderRecursively(dirHandle);
      const filesArray = [];

      // 2. Loop through all immediate items inside the folder handle
      for await (const entry of dirHandleRecursive) {
        if (entry.kind === "file") {
          // 3. Resolve the actual native File object metadata
          const fileData = await entry.getFile();

          // --- Reading File Contents (Example: Parsing JSON Files) ---
          if (fileData.name.endsWith(".json")) {
            try {
              const textContent = await fileData.text();
              const parsedJson = JSON.parse(textContent);
              console.log(`Contents of ${fileData.name}:`, parsedJson);
            } catch (err) {
              console.warn(`Could not read/parse ${fileData.name}:`, err);
            }
          }

          filesArray.push({
            name: fileData.name,
            size: fileData.size,
            type: fileData.type,
            lastModified: fileData.lastModifiedDate,
          });
        }
      }

      setFileList(filesArray);
    } catch (error) {
      console.error("Directory read failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Local Directory File Scanner</h2>

      <button onClick={handleOpenFolder} disabled={loading} style={styles.btn}>
        {loading ? "Reading Folder..." : "📁 Choose Directory"}
      </button>

      <ul style={styles.ul}>
        {fileList.length === 0 && <li>No folder loaded yet.</li>}
        {fileList.map((file, i) => (
          <li key={i} style={styles.li}>
            📄 <strong>{file.name}</strong> - {(file.size / 1024).toFixed(2)} KB
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  btn: {
    padding: "10px 20px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  ul: {
    marginTop: "20px",
    background: "#fff",
    padding: "15px",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  li: {
    listStyle: "none",
    padding: "6px 0",
    borderBottom: "1px solid #eee",
    fontFamily: "monospace",
  },
};
