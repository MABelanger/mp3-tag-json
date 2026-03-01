import { useEffect, useState } from "react";
import {
  COMMAND_SELECT_NEXT,
  COMMAND_SELECT_PREVIOUS,
} from "./commandConstant";

const SELECT_NEXT_KEY = "k";
const SELECT_PREVIOUS_KEY = "j";

const SELECT_NEXT_ARROW = "ArrowDown";
const SELECT_PREVIOUS_ARROW = "ArrowUp";

function getCommand(key) {
  const isKeySelectNext = key === SELECT_NEXT_KEY || key === SELECT_NEXT_ARROW;
  if (isKeySelectNext) {
    return COMMAND_SELECT_NEXT;
  }

  const isKeySelectPrevious =
    key === SELECT_PREVIOUS_KEY || key === SELECT_PREVIOUS_ARROW;
  if (isKeySelectPrevious) {
    return COMMAND_SELECT_PREVIOUS;
  }

  return null;
}

export function useMp3SectionsCommand(numberOfSection) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onKeyDown(event) {
    event.preventDefault(); // Prevent page scrolling
    const command = getCommand(event.key);
    if (command == COMMAND_SELECT_NEXT) {
      setSelectedIndex((prev) => {
        if (prev < numberOfSection) {
          const current = prev + 1;
          return current;
        }
        return prev;
      });
    } else if (command == COMMAND_SELECT_PREVIOUS) {
      setSelectedIndex((prev) => {
        const current = prev - 1;
        if (prev > 0) {
          return current;
        }
        return prev;
      });
    }
    console.log("handleKeyDown selectedIndex :", selectedIndex);
  }

  return {
    onKeyDown,
    selectedIndex,
  };
}
