import React, { useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { FormDropdowns } from "./FormDropdowns";
import FormTextInputs from "./FormTextInputs";
import { FormHashTags } from "./FormHashTags";

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

  console.log("props.settings", props.settings);

  // Compute base fallbacks directly from config shapes
  const defaultValues = {};
  dropdowns.forEach((key) => (defaultValues[key] = dropdownRange?.min ?? 0));
  textInputs.forEach((key) => (defaultValues[key] = key === "bpm" ? 0 : ""));
  hashTags.forEach((key) => (defaultValues[key] = ""));

  const useFormmethods = useForm({ defaultValues });

  // 1. Maintain a mutable reference to the parent callback to bypass dependency updates
  const onChangeRef = useRef(props.onChange);

  useEffect(() => {
    onChangeRef.current = props.onChange;
  }, [props.onChange]);

  // 2. Sealed, atomic event subscription tracking user mutations exclusively
  useEffect(() => {
    // Fire initial or reset state values directly to the listener once upon mounting
    if (onChangeRef.current) {
      onChangeRef.current(useFormmethods.getValues());
    }

    // Monitor internal form execution without forcing rendering loop teardowns
    const subscription = useFormmethods.watch((value) => {
      console.log("Form genuinely changed via user input event:", value);
      if (onChangeRef.current) {
        onChangeRef.current(value);
      }
    });

    return () => subscription.unsubscribe();
  }, [useFormmethods]);

  // 3. Keep form tree synchronized when initial track datasets arrive asynchronously
  useEffect(() => {
    console.log("props.initFormData", props.initFormData);
    const isObjEmpty = getIsObjEmpty(props.initFormData);

    if (isObjEmpty) {
      useFormmethods.reset(defaultValues);
    } else {
      useFormmethods.reset(props.initFormData);
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

  const rowContainerStyle = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "2.5rem",
    alignItems: "flex-start",
    marginBottom: "1rem",
  };

  return (
    <div style={containerStyle}>
      <FormProvider {...useFormmethods}>
        <form onSubmit={useFormmethods.handleSubmit(handleSave)}>
          <div style={rowContainerStyle}>
            <div style={{ flex: "0 0 auto" }}>
              <FormDropdowns fields={dropdowns} range={dropdownRange} />
            </div>

            <div style={{ flex: "0 0 auto" }}>
              <FormTextInputs fields={textInputs} />
            </div>
          </div>

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
