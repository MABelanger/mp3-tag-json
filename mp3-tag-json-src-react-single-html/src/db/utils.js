const rawUiLayout = {
  dropdownRange: {
    min: 0,
    max: 10,
  },
  dropdowns: ["expention", "festive", "contact", "rythmic", "bass", "curve"],
  textInputs: ["bpm", "notes"],
  hashTags: ["instruments", "cues"],
};

function generateSearchConfig(uiLayout) {
  const config = [];

  // 1. Process Text Inputs -> Maps to numeric ranges with a default variance
  if (uiLayout.textInputs) {
    uiLayout.textInputs.forEach((key) => {
      config.push({
        key: key,
        type: "range",
        variance: key === "bpm" ? 5 : 2, // Custom logic or fallback default
      });
    });
  }

  // 2. Process Dropdowns -> Maps to tight numeric ranges (variance 1)
  if (uiLayout.dropdowns) {
    uiLayout.dropdowns.forEach((key) => {
      config.push({
        key: key,
        type: "range",
        variance: 1,
      });
    });
  }

  // 3. Process HashTags -> Maps to exact matching multi-value array lookups
  if (uiLayout.hashTags) {
    uiLayout.hashTags.forEach((key) => {
      config.push({
        key: key,
        type: "exact",
        multiValue: true,
      });
    });
  }

  return config;
}

// Generate the configuration
export const SEARCH_CONFIG = generateSearchConfig(rawUiLayout);
console.log(SEARCH_CONFIG);
