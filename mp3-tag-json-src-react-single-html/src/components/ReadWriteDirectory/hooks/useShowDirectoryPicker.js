import { useState } from "react";

export function useShowDirectoryPicker() {
  async function showDirectoryPicker() {
    try {
      const dirRootHandle = await window.showDirectoryPicker({
        mode: "readwrite",
      });
      return dirRootHandle;
    } catch (err) {
      console.error("Error accessing file system:", err);
    }
  }

  return {
    showDirectoryPicker,
  };
}
