import { useRef, useEffect } from "react";
import { finderStore } from "../../hooks/finderStore"; // Ensure the path points to your new store file
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
  // Changing a ref's .current value NEVER triggers a React re-render.
  const selectedIndexRef = useRef(0);

  // 2. AUTO-FOLLOW VIEWPORT SNAP:
  // We subscribe to the store outside of React's state machine to handle scrolling smoothly
  useEffect(() => {
    const unsubscribe = finderStore.subscribe(() => {
      const globalIndex = finderStore.getSelectedIndex();
      // Keep our internal keyboard pointer in sync with any mouse clicks
      selectedIndexRef.current = globalIndex;
    });
    return () => unsubscribe();
  }, []);

  function onKeyDown(event) {
    const command = getCommand(event.key);
    if (!command) return;

    event.preventDefault(); // Stop default browser page layout window scrolling

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

    // 3. Update memory instantly (0% rendering overhead)
    selectedIndexRef.current = nextIndex;
    console.log(
      "Keyboard shifted index reference to:",
      selectedIndexRef.current
    );

    // 4. Push the new value straight into the external store channel.
    // This updates ONLY the 2 rows changing states, bypassing the parent completely!
    finderStore.setSelectedIndex(nextIndex);
  }

  return {
    onKeyDown,
  };
}
