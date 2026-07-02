import React from "react";
import { useFormContext } from "react-hook-form";

const FormDropdowns = ({ fields, range }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const min = range?.min ?? 0;
  const max = range?.max ?? 10;
  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  // New Flex Container Style to wrap item columns side-by-side
  const gridContainerStyle = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "1.5rem", // Generates uniform spacing between components
    marginBottom: "1rem",
  };

  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    marginBottom: "0.5rem", // Managed separation using container gap instead
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
    width: "90px", // Locks down the element width strictly to 50px
    boxSizing: "border-box", // Fixes issues where padding adds to element width
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

      {/* Dynamic Grid Layout Wrapper */}
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
