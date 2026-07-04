import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import FormDropdowns from "./FormDropdowns";
import FormTextInputs from "./FormTextInputs";
import FormHashTags from "./FormHashTags";
import { useEffect } from "react";

function getIsObjEmpty(obj) {
  if (!obj) {
    return true;
  }
  return Object.keys(obj).length === 0;
}

export const DynamicForm = (props) => {
  if (!props.settings) return <p>No configuration provided.</p>;

  const {
    dropdownRange,
    dropdowns = [],
    textInputs = [],
    hashTags = [],
  } = props.settings;

  // Compute base fallbacks directly from config shapes
  const defaultValues = {};
  dropdowns.forEach((key) => (defaultValues[key] = dropdownRange?.min ?? 0));
  textInputs.forEach((key) => (defaultValues[key] = key === "bpm" ? 0 : ""));
  hashTags.forEach((key) => (defaultValues[key] = ""));

  const useFormmethods = useForm({ defaultValues });

  useEffect(() => {
    console.log("props.initFormData", props.initFormData);
    const isObjEmpty = getIsObjEmpty(props.initFormData);

    if (isObjEmpty) {
      useFormmethods.reset(defaultValues);
    } else {
      useFormmethods.reset(props.initFormData); // Initializes form once data arrives
    }
  }, [useFormmethods.reset, props.initFormData]);

  const handleSave = (data) => {
    props.onSave(data);
  };

  const containerStyle = {
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

  // Add this new style rule to your component styles
  const rowContainerStyle = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap", // Allows graceful wrapping to a new line on narrow/mobile screens
    gap: "2.5rem", // Adjust this value to control the blank space between the two sections
    alignItems: "flex-start",
    marginBottom: "1rem",
  };

  // ... inside your ConfigurableForm component render:
  return (
    <div style={containerStyle}>
      <FormProvider {...useFormmethods}>
        <form onSubmit={useFormmethods.handleSubmit(handleSave)}>
          {/* New Shared Row Layout Wrapper */}
          <div style={rowContainerStyle}>
            <div style={{ flex: "0 0 auto" }}>
              <FormDropdowns fields={dropdowns} range={dropdownRange} />
            </div>

            <div style={{ flex: "0 0 auto" }}>
              <FormTextInputs fields={textInputs} />
            </div>
          </div>

          {/* This stays below on its own row */}
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
