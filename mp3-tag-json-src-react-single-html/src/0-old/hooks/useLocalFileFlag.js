import { useCallback, useEffect, useRef, useState } from "react";

export function useLocalFileFlag() {
  const [isLocalFileFlag, setIsLocalFileFlag] = useState(false);
  fetch("file:///home/data/my_data/dev/dj-project/mp3-tag-json/data/test.txt")
    .then((response) => response.text())
    .then((data) => {
      console.log("Success! Flag is ACTIVE:", data);
      setIsLocalFileFlag(true);
    })
    .catch((err) => console.error("Failed! Flag is INACTIVE:", err));

  return { isLocalFileFlag };
}
