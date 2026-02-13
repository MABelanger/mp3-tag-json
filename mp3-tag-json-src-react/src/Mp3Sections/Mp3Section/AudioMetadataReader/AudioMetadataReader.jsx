import React from "react";
import { useAudioMetadataReader } from "./hooks/useAudioMetadataReader";

export function AudioMetadataReader(props) {
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
                style={{ maxWidth: "200px" }}
              />
            </div>
          ) : (
            <p>No cover art found.</p>
          )}
        </div>
      )}
    </div>
  );
}
