import { useRef } from "react";
import { selectionStore } from "../selectionStore"; // Path to your selectionStore file
import {
  COMMAND_SELECT_NEXT,
  COMMAND_SELECT_PREVIOUS,
} from "./commandConstant";

const SELECT_NEXT_KEY = "j";
const SELECT_PREVIOUS_KEY = "k";
const SELECT_NEXT_ARROW = "ArrowDown";
const SELECT_PREVIOUS_ARROW = "ArrowUp";

function getCommand(key) {
  if (key === SELECT_NEXT_KEY || key === SELECT_NEXT_ARROW)
    return COMMAND_SELECT_NEXT;
  if (key === SELECT_PREVIOUS_KEY || key === SELECT_PREVIOUS_ARROW)
    return COMMAND_SELECT_PREVIOUS;
  return null;
}

export function useMp3SectionsCommand(numberOfSection) {
  // 1. Swap useState to a mutable reference object
  const selectedIndexRef = useRef(0);

  function onKeyDown(event) {
    const command = getCommand(event.key);
    if (!command) return;

    event.preventDefault(); // Stop default web layout window scrolling behavior

    let nextIndex = selectedIndexRef.current;

    if (command === COMMAND_SELECT_NEXT) {
      if (selectedIndexRef.current < numberOfSection) {
        nextIndex = selectedIndexRef.current + 1;
      }
    } else if (command === COMMAND_SELECT_PREVIOUS) {
      if (selectedIndexRef.current > 0) {
        nextIndex = selectedIndexRef.current - 1;
      }
    }

    // 2. Update the ref (Zero React re-render overhead!)
    selectedIndexRef.current = nextIndex;
    console.log("Memory value changed to:", selectedIndexRef.current);

    // 3. Broadcast the change straight to the selection store channel.
    // This targets ONLY the row left and the row entered, triggering just 2 updates!
    selectionStore.setSelectedIndex(nextIndex);
  }

  // Helper utility function if you ever need to manually set the ref from a click handler
  const setSelectedIndex = (index) => {
    selectedIndexRef.current = index;
    selectionStore.setSelectedIndex(index);
  };

  return {
    onKeyDown,
    selectedIndexRef, // Expose the ref instead of state string properties
    setSelectedIndex,
  };
}
