import { useState } from "react";

export function useShowDirectoryPicker() {
  async function showDirectoryPicker() {
    try {
      const dirHandle = await window.showDirectoryPicker({ mode: "readwrite" });
      return dirHandle;
    } catch (err) {
      console.error("Error accessing file system:", err);
    }
  }

  return {
    showDirectoryPicker,
  };
}
