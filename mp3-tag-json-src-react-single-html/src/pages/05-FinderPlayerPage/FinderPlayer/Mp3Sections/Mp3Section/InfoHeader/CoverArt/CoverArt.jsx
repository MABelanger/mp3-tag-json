import React from "react";
import { useAudioMetadataReader } from "./hooks/AudioMetadataReaderHooks";

export function CoverArtComponent(props) {
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
                style={{ width: "120px", height: "120px" }}
              />
            </div>
          ) : (
            <p style={{ width: "120px" }}>
              No cover <br />
              art found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export const CoverArt = React.memo(
  CoverArtComponent,
  (prevProps, nextProps) => {
    return prevProps.audioUrl === nextProps.audioUrl;
  }
);
