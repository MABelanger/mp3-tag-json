import React, { createContext, useContext } from "react";

const SelectionContext = createContext(null);

export function SelectionProvider({ children, value }) {
  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  return useContext(SelectionContext);
}
