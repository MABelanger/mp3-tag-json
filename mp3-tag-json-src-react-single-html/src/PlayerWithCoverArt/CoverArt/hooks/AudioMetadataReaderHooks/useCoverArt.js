import { useEffect, useState } from "react";

export function useCoverArt(metadata) {
  const [coverArt, setCoverArt] = useState(null);

  function doSetCoverArt() {
    // 3. Extract and prepare the cover art
    if (metadata.picture && metadata.picture.length > 0) {
      const picture = metadata.picture[0];
      // Convert the raw image data (Buffer/Uint8Array) to a Base64 string
      const blob = new Blob([new Uint8Array(picture.data)], {
        type: "image/jpeg",
      });
      const imageUrl = URL.createObjectURL(blob);
      setCoverArt(imageUrl);
    } else {
      setCoverArt(null);
    }
  }

  useEffect(() => {
    if (metadata) {
      doSetCoverArt();
    }
  }, [metadata]);

  return { coverArt };
}
