import { useEffect, useState, useRef } from "react";
import { FixedSizeList as List } from "react-window";
import { useReadFile } from "../../../components/ReadWriteDirectory/hooks/useReadFile";
import { useSearchIndexDb } from "./hooks/useSearchIndexDb11";
import { DynamicForm } from "../../../components/ui/DynamicForm";
import { Mp3Sections } from "./Mp3Sections";
// Note: We will render individual rows directly inside the List window now

export function FinderPlayer(props) {
  const { setPage, setFilters, filters, results, loading, error, hasMore } =
    useSearchIndexDb(20);

  const { fileData: settings } = useReadFile(
    props.dirRootHandle,
    "settings.json"
  );
  const [accumulatedResults, setAccumulatedResults] = useState([]);
  const listRef = useRef(null);

  // Clear accumulated data when filters change
  useEffect(() => {
    setAccumulatedResults([]);
    setPage(1);
    if (listRef.current) {
      listRef.current.scrollTo(0); // Snap virtualization window back to top
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

  // Triggers the next database page when the user scrolls near the end of the virtual list
  const handleItemsRendered = ({ visibleStopIndex }) => {
    // If the user's view window gets within 5 items of the total loaded data
    if (
      hasMore &&
      !loading &&
      visibleStopIndex >= accumulatedResults.length - 5
    ) {
      setPage((currentPage) => currentPage + 1);
    }
  };

  // Row Renderer Component: Renders ONLY the 20 elements currently visible
  const Row = ({ index, style }) => {
    const item = accumulatedResults[index];

    if (!item) return <div style={style}>Loading track data...</div>;

    return (
      <div style={style}>
        {/* Pass down only a single row item to keep render footprint small */}
        <Mp3Sections results={[item]} dirRootHandle={props.dirRootHandle} />
      </div>
    );
  };

  function handleChange(filters) {
    setFilters(filters);
  }

  return (
    <div
      className="list-container"
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <DynamicForm settings={settings} onChange={handleChange} />

      {/* The Virtualized Windowing container */}
      <div style={{ flex: 1, width: "100%" }}>
        <List
          ref={listRef}
          height={600} // Total height of the scroll container window box
          itemCount={accumulatedResults.length}
          itemSize={80} // Fixed height of each row item (matches your 80px requirement from earlier)
          width="100%"
          onItemsRendered={handleItemsRendered}
        >
          {Row}
        </List>
      </div>

      {loading && (
        <p
          style={{
            textAlign: "center",
            position: "absolute",
            bottom: 10,
            width: "100%",
          }}
        >
          Loading tracks...
        </p>
      )}
    </div>
  );
}
