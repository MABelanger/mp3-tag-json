import React from "react";
import { useAudioMetadataReader } from "./hooks/AudioMetadataReaderHooks";

export function CoverArt(props) {
  const { metadata, coverArt, fetchError } = useAudioMetadataReader(
    props.audioUrl
  );

  return (
    <div>
      {fetchError && <p style={{ color: "red" }}>Error: {fetchError}</p>}
      {metadata && (
        <div style={{ marginTop: "20px" }}>
          {coverArt ? (
            <div style={{ textAlign: "center" }}>
              <img
                src={coverArt}
                alt="Album Art"
                style={{ width: "400px", height: "400px" }}
              />
            </div>
          ) : (
            <p style={{ width: "400px" }}>
              No cover <br />
              art found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
