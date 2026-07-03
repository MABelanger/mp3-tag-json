import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";

const FormDropdowns = ({ fields, range }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  // Track mobile state for absolute responsive control
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // Triggers vertical stack if screen width drops below 600px
      setIsMobile(window.innerWidth < 600);
    };

    // Set initial layout state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const min = range?.min ?? 0;
  const max = range?.max ?? 10;
  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  const gridContainerStyle = {
    display: "flex",
    // Automatically switches layout direction to stack vertically on small screens
    flexDirection: isMobile ? "column" : "row",
    flexWrap: "wrap",
    gap: "1.5rem",
    marginBottom: "1rem",
  };

  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    marginBottom: "0.5rem",
    // Forces the field container to span full width on mobile viewports
    width: isMobile ? "100%" : "auto",
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
    // Scales to full width on mobile so it is touch-friendly, stays 90px on desktop
    width: isMobile ? "100%" : "90px",
    boxSizing: "border-box",
  };

  const errorStyle = {
    color: "#dc2626",
    fontSize: "0.85rem",
    marginTop: "0.25rem",
    maxWidth: "120px",
  };

  if (!fields.length) return null;

  return (
    <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
      <legend
        style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}
      >
        Metrics
      </legend>

      <div style={gridContainerStyle}>
        {fields.map((name) => (
          <div key={name} style={fieldStyle}>
            <label style={labelStyle}>{name.replace(/([A-Z])/g, " $1")}</label>
            <select
              {...register(name, { valueAsNumber: true })}
              style={{
                ...inputStyle,
                borderColor: errors[name] ? "#dc2626" : "#ccc",
              }}
            >
              {options.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            {errors[name] && (
              <span style={errorStyle}>{errors[name]?.message}</span>
            )}
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default FormDropdowns;
