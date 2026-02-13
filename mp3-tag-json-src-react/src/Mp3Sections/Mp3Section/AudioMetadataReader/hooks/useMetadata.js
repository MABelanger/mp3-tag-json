import { useEffect, useState } from "react";
import * as musicMetadata from "music-metadata";

export function useMetadata(arrayBuffer) {
  const [metadata, setMetadata] = useState(null);

  async function doSetMetadata() {
    try {
      // 2. Parse the metadata from the ArrayBuffer
      const { common: metadata } = await musicMetadata.parseBlob(
        new Blob([arrayBuffer])
      );
      setMetadata(metadata);
    } catch (err) {
      console.error("Error parsing metadata:", err);
    }
  }

  useEffect(() => {
    if (arrayBuffer) {
      doSetMetadata();
    }
  }, [arrayBuffer]);

  return { metadata };
}
