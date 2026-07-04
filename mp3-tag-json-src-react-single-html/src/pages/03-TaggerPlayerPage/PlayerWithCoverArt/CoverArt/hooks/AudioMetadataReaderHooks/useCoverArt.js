import { useEffect, useState } from "react";

export function useCoverArt(metadata) {
  const [coverArt, setCoverArt] = useState(null);

  useEffect(() => {
    let imageUrl = null;
    if (metadata) {
      // 3. Extract and prepare the cover art
      if (metadata.picture && metadata.picture.length > 0) {
        const picture = metadata.picture[0];
        // Convert the raw image data (Buffer/Uint8Array) to a Base64 string
        const blob = new Blob([new Uint8Array(picture.data)], {
          type: "image/jpeg",
        });
        imageUrl = URL.createObjectURL(blob);
        setCoverArt(imageUrl);
      } else {
        setCoverArt(null);
      }
    }
    // 4. Return cleanup function to revoke memory
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [metadata]);

  return { coverArt };
}
