import React, { useState } from "react";

// Scoped inline styles mimicking your original CSS
const styles = {
  body: {
    fontFamily: "sans-serif",
    padding: "20px",
    background: "#f4f4f9",
    minHeight: "100vh",
  },
  code: {
    display: "block",
    margin: "10px 0",
    fontFamily: "monospace",
  },
  btn: {
    display: "inline-block",
    padding: "10px 20px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    userSelect: "none",
  },
  ul: {
    marginTop: "20px",
    background: "white",
    padding: "20px",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  li: {
    padding: "5px 0",
    borderBottom: "1px solid #eee",
    fontFamily: "monospace",
    listStyle: "none",
  },
};

export function LocalDirectoryLister(props) {
  return (
    <div style={styles.body}>
      <ul style={styles.ul}>
        {props.mp3FilesArray.map((file, index) => (
          <li key={index} style={styles.li}>
            📄 {file.webkitRelativePath || file.name} (
            {(file.size / 1024).toFixed(1)} KB)
          </li>
        ))}
      </ul>
    </div>
  );
}
