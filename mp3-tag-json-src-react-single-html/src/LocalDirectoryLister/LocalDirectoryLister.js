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

export default function LocalDirectoryLister(props) {
  const hasFiles = props.list.length > 0;

  return (
    <div style={styles.body}>
      <ul style={styles.ul}>
        {!hasFiles && (
          <li style={{ ...styles.li, color: "#666" }}>
            No folder selected yet.
          </li>
        )}

        {props.files.map((file, index) => (
          <li key={index} style={styles.li}>
            {file.webkitRelativePath || file.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
