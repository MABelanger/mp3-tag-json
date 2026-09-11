import { useEffect, useRef, useState } from "react";

import { useReadFile } from "../../../components/ReadWriteDirectory/hooks/useReadFile";

import { useSearchIndexDb } from "./hooks/useSearchIndexDb11";
import { DynamicForm } from "../../../components/ui/DynamicForm";
import { Results } from "./Results";
import { Mp3Sections } from "./Mp3Sections";

export function FinderPlayer(props) {
  // 1. Get your hook states
  const { setPage, setFilters, filters, results, loading, error, hasMore } =
    useSearchIndexDb(20);

  const { fileData: settings } = useReadFile(
    props.dirRootHandle,
    "settings.json"
  );

  // 2. Local state to accumulate the rows across pages
  const [accumulatedResults, setAccumulatedResults] = useState([]);

  // 3. Create a reference element for the bottom observer boundary
  const observerTarget = useRef(null);

  // EFFECT A: Clear accumulated data when filters change
  useEffect(() => {
    setAccumulatedResults([]); // Wipe data so the new filtered search starts fresh
    setPage(1); // Reset back to page 1
  }, [filters, setPage]);

  // EFFECT B: Append new results whenever the hook fetches a new page
  useEffect(() => {
    if (results && results.length > 0) {
      setAccumulatedResults((prevData) => {
        // Prevent duplicate items if the effect runs twice (Strict Mode safety)
        const existingIds = new Set(prevData.map((item) => item.id));
        const uniqueNewResults = results.filter(
          (item) => !existingIds.has(item.id)
        );

        return [...prevData, ...uniqueNewResults];
      });
    }
  }, [results]);

  // EFFECT C: Monitor scroll positioning to advance pages
  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.isIntersecting) {
          setPage((currentPage) => {
            console.log("currentPage", currentPage);
            return currentPage + 1;
          });
        }
      },
      {
        threshold: 1.0,
        rootMargin: "150px", // Fetches early for a seamless feel
      }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loading, setPage]);

  function handleChange(filters) {
    const jsonData = JSON.stringify(filters, null, 2);
    console.log("jsonData", jsonData);
    setFilters(filters);
  }

  console.log("hasMore", hasMore);

  return (
    <div className="list-container">
      {/* 4. ALWAYS render from accumulatedResults, not results */}
      <DynamicForm settings={settings} onChange={handleChange} />

      <Mp3Sections
        results={accumulatedResults}
        dirRootHandle={props.dirRootHandle}
      />

      {/* 5. The invisible trigger placeholder element */}
      <div
        ref={observerTarget}
        style={{ height: "10px", width: "100%", backgroundColor: "red" }}
      />

      {/* Interface UX indicators */}
      {loading && <p style={{ textAlign: "center" }}>Loading tracks...</p>}
      {!hasMore && accumulatedResults.length > 0 && (
        <p style={{ textAlign: "center", color: "#888" }}>All items loaded.</p>
      )}
    </div>
  );
}
