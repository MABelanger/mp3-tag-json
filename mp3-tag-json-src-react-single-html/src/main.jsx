// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { App } from "./App.jsx";

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );

// src/index.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";

// Keep track of the active root outside the function scope
let activeRoot = null;

export function mountWidget(targetId, props = {}) {
  console.log("props", props);
  const container = document.getElementById(targetId);
  if (!container) return;

  // If a root already exists, unmount it first to clear out the old session safely
  if (activeRoot) {
    activeRoot.unmount();
  }

  // Create a clean root and render
  activeRoot = createRoot(container);
  activeRoot.render(<App {...props} />);
}
