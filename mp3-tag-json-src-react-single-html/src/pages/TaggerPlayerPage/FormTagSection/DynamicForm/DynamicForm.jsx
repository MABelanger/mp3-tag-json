import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import FormDropdowns from "./FormDropdowns";
import FormTextInputs from "./FormTextInputs";
import FormHashTags from "./FormHashTags";

export const DynamicForm = ({ config }) => {
  if (!config) return <p>No configuration provided.</p>;

  const {
    dropdownRange,
    dropdowns = [],
    textInputs = [],
    hashTags = [],
  } = config;

  // Compute base fallbacks directly from config shapes
  const defaultValues = {};
  dropdowns.forEach((key) => (defaultValues[key] = dropdownRange?.min ?? 0));
  textInputs.forEach((key) => (defaultValues[key] = key === "bpm" ? 120 : ""));
  hashTags.forEach((key) => (defaultValues[key] = ""));

  const methods = useForm({ defaultValues });

  const onSubmit = (data) => {
    console.log("React Hook Form Submission Payload:", data);
  };

  const containerStyle = {
    maxWidth: "450px",
    margin: "2rem auto",
    fontFamily: "system-ui, sans-serif",
  };
  const buttonStyle = {
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    width: "100%",
    backgroundColor: "#2563eb",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "1rem",
  };

  return (
    <div style={containerStyle}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <FormDropdowns fields={dropdowns} range={dropdownRange} />

          <FormTextInputs fields={textInputs} />

          <FormHashTags fields={hashTags} />

          <button type="submit" style={buttonStyle}>
            Save Setup
          </button>
        </form>
      </FormProvider>
    </div>
  );
};

export default DynamicForm;
