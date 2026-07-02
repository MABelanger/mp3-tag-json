import React, { useState } from "react";

export function DynamicForm({ config }) {
  // Guard clause for empty or missing config
  if (!config) return <p>No configuration provided.</p>;

  const {
    dropdownRange,
    dropdowns = [],
    textInputs = [],
    hashTags = [],
  } = config;

  // 1. Initialize dynamic state based on config structures
  const [formState, setFormState] = useState(() => {
    const initialState = {};

    // Set dropdown defaults to min value
    dropdowns.forEach((key) => {
      initialState[key] = dropdownRange?.min ?? 0;
    });

    // Set text fields to empty strings
    textInputs.forEach((key) => {
      initialState[key] = "";
    });

    // Set hashtag fields to empty strings
    hashTags.forEach((key) => {
      initialState[key] = "";
    });

    return initialState;
  });

  // 2. Generic change handler updates fields matching state keys
  const handleChange = (key, value) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Generated Form Payload:", formState);
  };

  // 3. Generate options array from min/max bounds
  const getDropdownOptions = () => {
    const options = [];
    const min = dropdownRange?.min ?? 0;
    const max = dropdownRange?.max ?? 10;

    for (let i = min; i <= max; i++) {
      options.push(i);
    }
    return options;
  };

  // Shared structural styles
  const containerStyle = {
    maxWidth: "450px",
    margin: "2rem auto",
    fontFamily: "system-ui, sans-serif",
  };
  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    marginBottom: "1rem",
  };
  const labelStyle = {
    fontWeight: "600",
    marginBottom: "0.25rem",
    textTransform: "capitalize",
  };
  const inputStyle = {
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit}>
        {/* Render Dropdowns */}
        {dropdowns.map((name) => (
          <div key={name} style={fieldStyle}>
            <label style={labelStyle}>{name.replace(/([A-Z])/g, " $1")}</label>
            <select
              value={formState[name] ?? ""}
              onChange={(e) => handleChange(name, Number(e.target.value))}
              style={inputStyle}
            >
              {getDropdownOptions().map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        ))}

        {/* Render Text Inputs */}
        {textInputs.map((name) => (
          <div key={name} style={fieldStyle}>
            <label style={labelStyle}>{name === "bpm" ? "BPM" : name}</label>
            <input
              type="text"
              value={formState[name] ?? ""}
              onChange={(e) => handleChange(name, e.target.value)}
              placeholder={`Enter ${name}...`}
              style={inputStyle}
            />
          </div>
        ))}

        {/* Render Hashtags */}
        {hashTags.map((name) => (
          <div key={name} style={fieldStyle}>
            <label style={labelStyle}>#{name}</label>
            <input
              type="text"
              value={formState[name] ?? ""}
              onChange={(e) => handleChange(name, e.target.value)}
              placeholder="Separated by spaces or commas"
              style={inputStyle}
            />
          </div>
        ))}

        <button
          type="submit"
          style={{
            ...inputStyle,
            width: "100%",
            backgroundColor: "#10b981",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "1rem",
          }}
        >
          Submit Form
        </button>
      </form>
    </div>
  );
}
