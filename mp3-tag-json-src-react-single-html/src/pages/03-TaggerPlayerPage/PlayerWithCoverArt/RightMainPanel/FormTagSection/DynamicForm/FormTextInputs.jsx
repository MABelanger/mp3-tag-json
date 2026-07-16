import React from "react";
import { useFormContext } from "react-hook-form";

const FormTextInputs = ({ fields }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  // Balanced row arrangement copying your Dropdowns layout setup
  const gridContainerStyle = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "1.5rem", // Keeps a uniform spacing layout between the components
    marginBottom: "1rem",
  };

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
    width: "140px", // Sized up slightly from 90px so typed input words have enough canvas space
    boxSizing: "border-box", // Prevents inner padding values from breaking the absolute width constraint
  };

  const errorStyle = {
    color: "#dc2626",
    fontSize: "0.85rem",
    marginTop: "0.25rem",
    maxWidth: "140px",
  };

  if (!fields.length) return null;

  return (
    <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
      {/* Structural layout wrapper mapping text nodes side-by-side */}
      <div style={gridContainerStyle}>
        {fields.map((name) => (
          <div key={name} style={fieldStyle}>
            <label style={labelStyle}>{name === "bpm" ? "BPM" : name}</label>
            <input
              type={name === "bpm" ? "number" : "text"}
              {...register(name, { valueAsNumber: name === "bpm" })}
              placeholder={`Enter ${name}...`}
              style={{
                ...inputStyle,
                borderColor: errors[name] ? "#dc2626" : "#ccc",
              }}
            />
            {errors[name] && (
              <span style={errorStyle}>{errors[name]?.message}</span>
            )}
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default FormTextInputs;
