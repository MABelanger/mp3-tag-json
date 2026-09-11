import { useEffect, useState, useRef } from "react";
import { Virtuoso } from "react-virtuoso"; // Replacement for react-window
import { useReadFile } from "../../../components/ReadWriteDirectory/hooks/useReadFile";
import { useSearchIndexDb } from "./hooks/useSearchIndexDb11";
import { DynamicForm } from "../../../components/ui/DynamicForm";
import { Mp3Sections } from "./Mp3Sections";

export function FinderPlayer(props) {
  const { setPage, setFilters, filters, results, loading, error, hasMore } =
    useSearchIndexDb(20);

  const { fileData: settings } = useReadFile(
    props.dirRootHandle,
    "settings.json"
  );

  const [accumulatedResults, setAccumulatedResults] = useState([]);
  const virtuosoRef = useRef(null);

  // Clear accumulated data when filters change
  useEffect(() => {
    setAccumulatedResults([]);
    setPage(1);
    if (virtuosoRef.current) {
      // Snaps virtualization window back to the top
      virtuosoRef.current.scrollToIndex({ index: 0 });
    }
  }, [filters, setPage]);

  // Append new pages to memory database
  useEffect(() => {
    if (results && results.length > 0) {
      setAccumulatedResults((prevData) => {
        const existingIds = new Set(prevData.map((item) => item.id));
        const uniqueNewResults = results.filter(
          (item) => !existingIds.has(item.id)
        );
        return [...prevData, ...uniqueNewResults];
      });
    }
  }, [results]);

  // Handler for loading next page when scrolling near the end
  const loadMore = () => {
    if (hasMore && !loading) {
      setPage((currentPage) => currentPage + 1);
    }
  };

  function handleChange(filters) {
    setFilters(filters);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <DynamicForm settings={settings} onChange={handleChange} />

      {/* The Virtualized Windowing container */}
      <div style={{ flex: 1, width: "100%" }}>
        <Virtuoso
          ref={virtuosoRef}
          style={{ height: "650px", width: "100%" }}
          data={accumulatedResults}
          components={{
            Scroller: ({ children, ...props }) => (
              <div
                {...props}
                tabIndex={0} // Makes the scroll wrapper focusable so it registers keys
                onKeyDown={(e) => {
                  console.log("Key pressed inside list wrapper:", e.key);
                  if (e.key === "ArrowDown") {
                    // Your custom navigation logic here
                  }
                }}
              >
                {children}
              </div>
            ),
          }}
          endReached={loadMore} // Triggers when the user gets near the bottom
          itemContent={(index, item) => {
            console.log("index", index);
            if (!item) return <div>Loading track data...</div>;
            return (
              <div style={{ height: "300px" }}>
                {" "}
                {/* Matches your row height */}
                <Mp3Sections
                  results={[item]}
                  dirRootHandle={props.dirRootHandle}
                />
              </div>
            );
          }}
        />
      </div>

      {loading && (
        <p
          style={{
            textAlign: "center",
            position: "absolute",
            bottom: 10,
            width: "100%",
            zIndex: 10,
          }}
        >
          Loading tracks...
        </p>
      )}
    </div>
  );
}
