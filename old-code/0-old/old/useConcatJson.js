import { useEffect } from "react";

async function mergeJsonFiles(jsonTracks) {
  let combinedData = [];

  for (const jsonTrack of jsonTracks) {
    try {
      console.log(jsonTrack);
      // Get the File object from the jsonTrack
      const file = await jsonTrack.handle.getFile();

      // Read the text content of the file
      const text = await file.text();

      // Parse the text into a JSON array or object
      const jsonData = JSON.parse(text);

      // Combine into the main array
      if (Array.isArray(jsonData)) {
        combinedData = combinedData.concat(jsonData);
      } else {
        combinedData.push(jsonData); // Handles files with a single JSON object
      }
    } catch (error) {
      console.error(`Error reading ${handle.name}:`, error);
    }
  }

  return combinedData;
}

export function useConcatJson(jsonTracks) {
  async function doConcatJson() {
    const merged = await mergeJsonFiles(jsonTracks);
    console.log("merged", merged);
  }
  useEffect(() => {
    doConcatJson();
  }, [jsonTracks]);
}
