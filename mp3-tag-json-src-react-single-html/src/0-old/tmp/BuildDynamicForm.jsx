import React, { useState } from "react";

const BuildDynamicForm = ({ config }) => {
  const { dropdownRange, dropdowns, textInputs, hashTags } = config;

  // Initialize state dynamically based on the config keys
  const [formData, setFormData] = useState({
    dropdowns: dropdowns.reduce(
      (acc, cur) => ({ ...acc, [cur]: dropdownRange.min }),
      {}
    ),
    textInputs: textInputs.reduce((acc, cur) => ({ ...acc, [cur]: "" }), {}),
    hashTags: hashTags.reduce((acc, cur) => ({ ...acc, [cur]: "" }), {}),
  });

  // Generate numeric options for the dropdowns
  const renderDropdownOptions = () => {
    const options = [];
    for (let i = dropdownRange.min; i <= dropdownRange.max; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return options;
  };

  // Handlers to update specific state slices
  const handleDropdownChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      dropdowns: { ...prev.dropdowns, [name]: Number(value) },
    }));
  };

  const handleTextChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      textInputs: { ...prev.textInputs, [name]: value },
    }));
  };

  const handleHashTagChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      hashTags: { ...prev.hashTags, [name]: value },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
  };

  // Basic layout styling
  const formStyle = {
    maxWidth: "500px",
    margin: "20px auto",
    fontFamily: "sans-serif",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  };

  const sectionStyle = {
    marginBottom: "20px",
  };

  const groupStyle = {
    display: "flex",
    flexDirection: "column",
    marginBottom: "12px",
  };

  const labelStyle = {
    fontWeight: "bold",
    marginBottom: "4px",
    textTransform: "capitalize",
  };

  const inputStyle = {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      {/* Dropdowns Section */}
      <div style={sectionStyle}>
        <h3>Sliders / Selectors</h3>
        {dropdowns.map((name) => (
          <div key={name} style={groupStyle}>
            <label style={labelStyle}>{name}</label>
            <style>{inputStyle}</style>
            <select
              value={formData.dropdowns[name]}
              onChange={(e) => handleDropdownChange(name, e.target.value)}
              style={inputStyle}
            >
              {renderDropdownOptions()}
            </select>
          </div>
        ))}
      </div>

      {/* Text Inputs Section */}
      <div style={sectionStyle}>
        <h3>Details</h3>
        {textInputs.map((name) => (
          <div key={name} style={groupStyle}>
            <label style={labelStyle}>{name.toUpperCase()}</label>
            <input
              type="text"
              value={formData.textInputs[name]}
              onChange={(e) => handleTextChange(name, e.target.value)}
              style={inputStyle}
              placeholder={`Enter ${name}`}
            />
          </div>
        ))}
      </div>

      {/* Hashtags Section */}
      <div style={sectionStyle}>
        <h3>Tags</h3>
        {hashTags.map((name) => (
          <div key={name} style={groupStyle}>
            <label style={labelStyle}>#{name}</label>
            <input
              type="text"
              value={formData.hashTags[name]}
              onChange={(e) => handleHashTagChange(name, e.target.value)}
              style={inputStyle}
              placeholder="e.g. tag1, tag2"
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        style={{
          ...inputStyle,
          backgroundColor: "#0070f3",
          color: "white",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Submit Configuration
      </button>
    </form>
  );
};

export default BuildDynamicForm;

/*
const App = () => {
  const formConfig = {
    dropdownRange: { min: 0, max: 10 },
    dropdowns: ["expention", "festive", "contact", "rythmic", "bass", "curve"],
    textInputs: ["bpm", "notes"],
    hashTags: ["instruments", "cues"]
  };

  return <DynamicForm config={formConfig} />;
};

export default App;
*/
