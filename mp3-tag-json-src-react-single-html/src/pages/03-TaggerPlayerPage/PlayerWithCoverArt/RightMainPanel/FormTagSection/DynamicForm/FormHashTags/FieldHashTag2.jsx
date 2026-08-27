const fieldStyle = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "0.5rem",
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
  width: "400px", // Sized up slightly to account for typing lists of tags
  boxSizing: "border-box", // Prevents inner padding values from breaking the absolute width constraint
};

const errorStyle = {
  color: "#dc2626",
  fontSize: "0.85rem",
  marginTop: "0.25rem",
  maxWidth: "400px",
};

import React, { useState } from "react";
import { Controller } from "react-hook-form";

export function FieldHashTag(props) {
  const [inputValue, setInputValue] = useState("");

  return (
    <div key={props.name} style={fieldStyle}>
      <label style={labelStyle}>#{props.name}Allo</label>

      {/* Inject Controller here so the parent stays completely unchanged */}
      <Controller
        name={props.name}
        control={props.control} // Assumes parent passes control, or useFormContext()
        render={({ field }) => {
          // Fallback to empty array if value is undefined/null
          const currentTags = Array.isArray(field.value) ? field.value : [];

          const handleKeyDown = (e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              let tag = inputValue.trim().replace(/\s+/g, "").toLowerCase();
              if (!tag) return;
              if (!tag.startsWith("#")) tag = `#${tag}`;

              if (!currentTags.includes(tag)) {
                field.onChange([...currentTags, tag]);
              }
              setInputValue("");
            } else if (
              e.key === "Backspace" &&
              !inputValue &&
              currentTags.length > 0
            ) {
              field.onChange(currentTags.slice(0, -1));
            }
          };

          const removeTag = (indexToRemove) => {
            field.onChange(currentTags.filter((_, i) => i !== indexToRemove));
          };

          return (
            <div
              style={{
                ...inputStyle,
                borderColor: props.errorMessage ? "#dc2626" : "#ccc",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "6px",
                padding: "6px",
              }}
            >
              {/* Render existing tags inside your custom input box UI */}
              {currentTags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: "#f3f4f6",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontSize: "14px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    style={{
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      fontWeight: "bold",
                      padding: 0,
                    }}
                  >
                    &times;
                  </button>
                </span>
              ))}

              {/* The actual underlying interactive text element */}
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  currentTags.length === 0 ? "e.g. ambient, tech" : ""
                }
                style={{
                  border: "none",
                  outline: "none",
                  flex: 1,
                  minWidth: "80px",
                  fontSize: "14px",
                }}
              />
            </div>
          );
        }}
      />

      {props.errorMessage && (
        <span style={errorStyle}>{props.errorMessage}</span>
      )}
    </div>
  );
}
