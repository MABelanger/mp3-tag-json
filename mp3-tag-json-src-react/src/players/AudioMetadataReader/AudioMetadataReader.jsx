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
          <h3>Metadata:</h3>
          <p>
            <strong>Title:</strong> {metadata.title}
          </p>
          <p>
            <strong>Artist:</strong> {metadata.artist}
          </p>
          <p>
            <strong>Album:</strong> {metadata.album}
          </p>
          {coverArt ? (
            <div>
              <h4>Cover Art:</h4>
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
