import React, { useState } from "react";

export function DirectoryWriter() {
  const [directoryHandle, setDirectoryHandle] = useState(null);
  const [status, setStatus] = useState("");

  // 1. Request access to a local directory
  const pickDirectory = async () => {
    try {
      const handle = await window.showDirectoryPicker({
        mode: "readwrite",
      });
      setDirectoryHandle(handle);
      setStatus(`Connected to: ${handle.name}`);
    } catch (err) {
      setStatus("Directory selection cancelled or failed.");
    }
  };

  // 2. Create and write a file inside that directory
  const createLocalFile = async () => {
    if (!directoryHandle) {
      setStatus("Please select a directory first.");
      return;
    }

    try {
      // Create (or look up) a file named "log.txt" inside the folder
      const fileHandle = await directoryHandle.getFileHandle("log.txt", {
        create: true,
      });

      // Create a writable stream to the file
      const writable = await fileHandle.createWritable();

      // Write your content
      await writable.write(
        "Hello! This file was written directly by the React app."
      );

      // Close the file stream to save changes
      await writable.close();
      setStatus("Successfully wrote log.txt to your folder!");
    } catch (err) {
      setStatus(`Error writing file: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Direct Folder Writer</h2>
      <button onClick={pickDirectory} style={styles.btn}>
        📁 1. Connect Folder
      </button>
      <button
        onClick={createLocalFile}
        style={styles.btnSuccess}
        disabled={!directoryHandle}
      >
        ✍️ 2. Write "log.txt"
      </button>
      <p>
        <strong>Status:</strong> {status}
      </p>
    </div>
  );
}

const styles = {
  btn: {
    padding: "10px 15px",
    marginRight: "10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  btnSuccess: {
    padding: "10px 15px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
