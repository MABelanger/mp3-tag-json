import React from "react";
import { useFormContext } from "react-hook-form";

const FormHashTags = ({ fields }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  // Balanced row arrangement copying your Dropdowns/Text layout setup
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
    width: "400px", // Sized up slightly to account for typing lists of tags
    boxSizing: "border-box", // Prevents inner padding values from breaking the absolute width constraint
  };

  const errorStyle = {
    color: "#dc2626",
    fontSize: "0.85rem",
    marginTop: "0.25rem",
    maxWidth: "400px",
  };

  if (!fields.length) return null;

  return (
    <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
      <legend
        style={{
          fontSize: "1.2rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          marginTop: "1rem",
        }}
      >
        Tags
      </legend>

      {/* Structural layout wrapper mapping hashtag nodes side-by-side */}
      <div style={gridContainerStyle}>
        {fields.map((name) => (
          <div key={name} style={fieldStyle}>
            <label style={labelStyle}>#{name}</label>
            <input
              type="text"
              {...register(name)}
              placeholder="e.g. ambient, tech"
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

export default FormHashTags;
