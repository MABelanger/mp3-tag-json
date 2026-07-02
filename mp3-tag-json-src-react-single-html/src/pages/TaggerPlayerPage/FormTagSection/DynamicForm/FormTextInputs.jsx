import React from "react";
import { useFormContext } from "react-hook-form";

const FormTextInputs = ({ fields }) => {
  const { register } = useFormContext();

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
        Details
      </legend>
      {fields.map((name) => (
        <div key={name} style={fieldStyle}>
          <label style={labelStyle}>{name === "bpm" ? "BPM" : name}</label>
          <input
            type={name === "bpm" ? "number" : "text"}
            {...register(name, { valueAsNumber: name === "bpm" })}
            placeholder={`Enter ${name}...`}
            style={inputStyle}
          />
        </div>
      ))}
    </fieldset>
  );
};

export default FormTextInputs;
