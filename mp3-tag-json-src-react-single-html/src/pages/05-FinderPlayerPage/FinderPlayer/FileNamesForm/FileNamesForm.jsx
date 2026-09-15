import React, { useState } from "react";
import { useFileNamesForm } from "./hooks/useFileNamesForm"; // Adjust import path as needed

export function FileNamesForm({ onChange }) {
  const { filteredFileNames, searchFileName, isLoading } = useFileNamesForm();
  const [searchValue, setSearchValue] = useState("");

  // Handle typing into the instant search filter
  function handleSearchChange(e) {
    const value = e.target.value;
    setSearchValue(value);
    searchFileName(value); // Calls your hook's ultra-fast memory filter
  }

  if (isLoading) {
    return <div style={{ padding: "10px" }}>Loading file indices...</div>;
  }

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "6px",
        padding: "16px",
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        backgroundColor: "#fff",
      }}
    >
      <label style={{ fontWeight: "bold", fontSize: "14px" }}>
        Filter Tracks by Name (OR matching)
      </label>

      {/* Input box to filter down the choices */}
      <input
        type="text"
        placeholder="Type keyword (e.g. 'fil')..."
        value={searchValue}
        onChange={handleSearchChange}
        style={{
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #aaa",
          width: "100%",
          boxSizing: "border-box",
        }}
      />

      <ul>
        {filteredFileNames.map((filteredFileName, index) => {
          return <li>{filteredFileName}</li>;
        })}
      </ul>
    </div>
  );
}
