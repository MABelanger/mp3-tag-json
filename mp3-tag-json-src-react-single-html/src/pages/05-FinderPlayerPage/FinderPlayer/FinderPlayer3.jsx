import { useState } from "react";

import { useReadFile } from "../../../components/ReadWriteDirectory/hooks/useReadFile";

import { useSearchIndexDb } from "./hooks/useSearchIndexDb10";
import { DynamicForm } from "../../../components/ui/DynamicForm";

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
    //setFilters(filters);
  }

  return (
    <div>
      <DynamicForm settings={settings} onChange={handleChange} />

      {loading && <p>Reading from IndexedDB...</p>}

      <ul>
        {results.map((track) => (
          <li key={track.id}>
            BPM: {track.bpm} | Instruments:{" "}
            {Array.isArray(track.instruments)
              ? track.instruments.join(",")
              : track.instruments}
            | cues:{" "}
            {Array.isArray(track.cues) ? track.cues.join(",") : track.cues}
          </li>
        ))}
      </ul>
    </div>
  );
}
