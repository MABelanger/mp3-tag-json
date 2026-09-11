import { useEffect, useRef, useState } from "react";

import { useReadFile } from "../../../components/ReadWriteDirectory/hooks/useReadFile";

import { useSearchIndexDb } from "./hooks/useSearchIndexDb11";
import { DynamicForm } from "../../../components/ui/DynamicForm";
import { Results } from "./Results";
import { Mp3Sections } from "./Mp3Sections";

export function FinderPlayer(props) {
  const { setPage, setFilters, filters, results, loading, error, hasMore } =
    useSearchIndexDb(20);

  const { fileData: settings } = useReadFile(
    props.dirRootHandle,
    "settings.json"
  );

  const [accumulatedResults, setAccumulatedResults] = useState([]);
  const observerTarget = useRef(null);

  // EFFECT A: Clear accumulated data when filters change
  useEffect(() => {
    setAccumulatedResults([]);
    setPage(1);
  }, [filters, setPage]);

  // EFFECT B: Append new results whenever the hook fetches a new page
  useEffect(() => {
    if (results && results.length > 0) {
      setAccumulatedResults((prevData) => {
        // NOTE: Ensure your objects use 'item.id'. If they use 'item.path', change it here!
        const existingIds = new Set(prevData.map((item) => item.id));
        const uniqueNewResults = results.filter(
          (item) => !existingIds.has(item.id)
        );

        return [...prevData, ...uniqueNewResults];
      });
    }
  }, [results]);

  // FIXED EFFECT C: Includes accumulatedResults length so it remaps
  // its position every time new rows push the target element down.
  useEffect(() => {
    // If we've reached the end or it's currently fetching, block the observer
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          console.log("Trigger visible! Requesting next page...");
          setPage((currentPage) => {
            console.log("currentPage moving from:", currentPage);
            return currentPage + 1;
          });
        }
      },
      {
        threshold: 0.1, // Changed to 0.1 so even if 1px enters the screen, it fires
        rootMargin: "100px",
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
  }, [hasMore, loading, setPage, accumulatedResults.length]); // Add length as dependency

  function handleChange(filters) {
    setFilters(filters);
  }

  return (
    <div className="list-container" style={{ minHeight: "100vh" }}>
      <DynamicForm settings={settings} onChange={handleChange} />

      <Mp3Sections
        results={accumulatedResults}
        dirRootHandle={props.dirRootHandle}
      />

      {/* FIXED TARGET: Display inline-block ensures layout calculation accuracy */}
      <div
        ref={observerTarget}
        style={{
          height: "20px",
          width: "100%",
          display: "inline-block",
          clear: "both",
          backgroundColor: "red", // Keep red temporarily to visibly track it
        }}
      />

      {loading && <p style={{ textAlign: "center" }}>Loading tracks...</p>}
      {!hasMore && accumulatedResults.length > 0 && (
        <p style={{ textAlign: "center", color: "#888" }}>All items loaded.</p>
      )}
    </div>
  );
}
