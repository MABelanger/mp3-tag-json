import { useState } from "react";

import { useReadFile } from "../../../components/ReadWriteDirectory/hooks/useReadFile";

import { useSearchIndexDb } from "./hooks/useSearchIndexDb11";
import { DynamicForm } from "../../../components/ui/DynamicForm";
import { Results } from "./Results";

export function FinderPlayer(props) {
  const { setPage, setFilters, filters, results, loading, error, hasMore } =
    useSearchIndexDb(20);

  console.log("results", results);

  console.log("props.jsonTracks", props.jsonTracks);

  const { fileData: settings } = useReadFile(
    props.dirRootHandle,
    "settings.json"
  );

  function handleChange(filters) {
    const jsonData = JSON.stringify(filters, null, 2);
    console.log("jsonData", jsonData);
    setFilters(filters);
  }

  return (
    <div>
      <DynamicForm settings={settings} onChange={handleChange} />

      {loading && <p>Reading from IndexedDB...</p>}

      <Results results={results} />
    </div>
  );
}
