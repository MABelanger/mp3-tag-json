import { useEffect, useState } from "react";

export function useFetchMp3ArrayBuffer(audioUrl) {
  const [error, setError] = useState(null);
  const [arrayBuffer, setArrayBuffer] = useState(null);

  async function doFetchMp3ArrayBuffer() {
    try {
      setError(null);
      // 1. Fetch the audio file from the URL as an ArrayBuffer
      const response = await fetch(audioUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      setArrayBuffer(arrayBuffer);
    } catch (err) {
      console.error("Error fetching or parsing metadata:", err);
      setError(err.message);
    }
  }

  useEffect(() => {
    doFetchMp3ArrayBuffer();
  }, []);

  return { arrayBuffer, fetchError: error };
}
