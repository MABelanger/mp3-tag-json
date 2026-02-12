import React, { useState } from "react";
// music-metadata-browser is used for client-side functionality
import * as mm from "music-metadata";

const AudioMetadataReader = ({ audioUrl }) => {
  const [metadata, setMetadata] = useState(null);
  const [coverArt, setCoverArt] = useState(null);
  const [error, setError] = useState(null);

  const fetchMetadata = async () => {
    try {
      setError(null);
      // 1. Fetch the audio file from the URL as an ArrayBuffer
      const response = await fetch(audioUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();

      // 2. Parse the metadata from the ArrayBuffer
      const { common } = await mm.parseBlob(new Blob([arrayBuffer]));
      setMetadata(common);

      // 3. Extract and prepare the cover art
      if (common.picture && common.picture.length > 0) {
        const picture = common.picture[0];
        // Convert the raw image data (Buffer/Uint8Array) to a Base64 string
        const base64String = btoa(
          String.fromCharCode(...new Uint8Array(picture.data))
        );
        const imageUrl = `data:${picture.format};base64,${base64String}`;
        setCoverArt(imageUrl);
      } else {
        setCoverArt(null);
      }
    } catch (err) {
      console.error("Error fetching or parsing metadata:", err);
      setError(err.message);
    }
  };

  return (
    <div>
      <button onClick={fetchMetadata}>Load Audio Metadata</button>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
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
};

export { AudioMetadataReader };
