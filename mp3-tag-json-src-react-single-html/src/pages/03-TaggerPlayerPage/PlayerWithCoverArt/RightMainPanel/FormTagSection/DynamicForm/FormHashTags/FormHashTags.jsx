import React from "react";
import { useFormContext } from "react-hook-form";
import { FieldHashTag } from "./FieldHashTag2";

export const FormHashTags = ({ fields }) => {
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

  if (!fields.length) return null;

  return (
    <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
      {/* Structural layout wrapper mapping hashtag nodes side-by-side */}
      <div style={gridContainerStyle}>
        {fields.map((name) => (
          <FieldHashTag
            errorMessage={errors[name]?.message}
            name={name}
            register={register}
          />
        ))}
      </div>
    </fieldset>
  );
};
