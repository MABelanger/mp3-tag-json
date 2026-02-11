import { useEffect, useState } from "react";

export function useMp3TagJson() {
  const [mp3TagJson, setMp3TagJson] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch data from public folder
    fetch("/api/mp3-tag.json", {
      cache: "no-store", // Disables browser caching
    })
      .then((response) => {
        if (!response.ok) {
          setError("Network response was not ok");
        }
        return response.json();
      })
      .then((mp3TagJson) => {
        setMp3TagJson(mp3TagJson);
        setIsLoading(false);
      })
      .catch((error) => {
        setError("Error fetching data, verify that server is running", error);
        setIsLoading(false);
      });
  }, []); // Empty dependency array ensures this runs once

  return { mp3TagJson, isLoading, error };
}
