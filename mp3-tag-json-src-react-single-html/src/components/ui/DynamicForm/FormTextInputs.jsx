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
        {fields.map((name) => {
          {
            /* 
              TODO : add a propriety to know if is the field is a text or number
              right now only the bpm is number but need to be more precise
              */
          }
          const isNumber = name === "bpm";

          return (
            <div key={name} style={fieldStyle}>
              <label style={labelStyle}>{name}</label>
              <input
                type={isNumber ? "number" : "text"}
                {...register(name, {
                  valueAsNumber: isNumber,
                })}
                placeholder={`Enter ${name}...`}
                onChange={(e) => {
                  // 1. Skip transformation if this is the numerical BPM field
                  if (isNumber) return;

                  // 2. Intercept the typed value and instantly force it lowercase
                  const lowercasedValue = e.target.value.toLowerCase();

                  // 3. Manually update the input field value on screen
                  e.target.value = lowercasedValue;
                }}
                style={{
                  ...inputStyle,
                  borderColor: errors[name] ? "#dc2626" : "#ccc",
                }}
              />
              {errors[name] && (
                <span style={errorStyle}>{errors[name]?.message}</span>
              )}
            </div>
          );
        })}
      </div>
    </fieldset>
  );
};

export default FormTextInputs;
