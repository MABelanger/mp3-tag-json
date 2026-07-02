import React from "react";
import { useFormContext } from "react-hook-form";

const FormDropdowns = ({ fields, range }) => {
  const { register } = useFormContext();

  const min = range?.min ?? 0;
  const max = range?.max ?? 10;
  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);

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
        style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}
      >
        Metrics
      </legend>
      {fields.map((name) => (
        <div key={name} style={fieldStyle}>
          <label style={labelStyle}>{name.replace(/([A-Z])/g, " $1")}</label>
          <select
            {...register(name, { valueAsNumber: true })}
            style={inputStyle}
          >
            {options.map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      ))}
    </fieldset>
  );
};

export default FormDropdowns;
