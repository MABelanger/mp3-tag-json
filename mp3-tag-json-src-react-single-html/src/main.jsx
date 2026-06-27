import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App.jsx";

// Keep track of the active root outside the function scope
let activeRoot = null;

export function mountWidget(targetId, props = {}) {
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
