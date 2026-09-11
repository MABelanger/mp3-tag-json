import { useEffect, useState, useRef, useCallback } from "react"; // Added useCallback
import { Virtuoso } from "react-virtuoso";
import { useReadFile } from "../../../components/ReadWriteDirectory/hooks/useReadFile";
import { useSearchIndexDb } from "./hooks/useSearchIndexDb11";
import { DynamicForm } from "../../../components/ui/DynamicForm";
import { Mp3Section } from "./Mp3Sections/Mp3Section";
import { useMp3SectionsCommand } from "./Mp3Sections/hooks/useMp3SectionsCommand";

export function FinderPlayer(props) {
  const { setPage, setFilters, filters, results, loading, error, hasMore } =
    useSearchIndexDb(20);

  const { fileData: settings } = useReadFile(
    props.dirRootHandle,
    "settings.json"
  );

  const [accumulatedResults, setAccumulatedResults] = useState([]);
  const numberOfSection = accumulatedResults.length - 1;
  const [playingIndex, setPlayingIndex] = useState(0);

  const { onKeyDown, selectedIndex, setSelectedIndex } =
    useMp3SectionsCommand(numberOfSection);

  const virtuosoRef = useRef(null);

  // 1. SCROLL AUTO-FOLLOW FIX: Whenever selectedIndex shifts via keyboard, tell Virtuoso to snap to it smoothly
  useEffect(() => {
    if (virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index: selectedIndex,
        behavior: "smooth",
        align: "center", // Keeps the active element centered on viewport lines
      });
    }
  }, [selectedIndex]);

  // Clear accumulated data when filters change
  useEffect(() => {
    setAccumulatedResults([]);
    setPage(1);
    if (virtuosoRef.current) {
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

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage((currentPage) => currentPage + 1);
    }
  };

  function handleChange(filters) {
    setFilters(filters);
  }

  // 2. FIXED: itemContent is now memoized so it NEVER forces layout recalculations.
  // It consumes dynamic states out of Virtuoso's 'context' container object instead.
  const renderItem = useCallback((i, result, context) => {
    if (!result) return <div>Loading track data...</div>;
    return (
      <div style={{ height: "300px" }}>
        <Mp3Section
          index={i}
          selectedIndex={context.selectedIndex}
          onClick={() => context.setSelectedIndex(i)}
          onPlay={() => context.setPlayingIndex(i)}
          playingIndex={context.playingIndex}
          dirRootHandle={context.dirRootHandle}
          result={result}
        />
      </div>
    );
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <DynamicForm settings={settings} onChange={handleChange} />

      <div style={{ flex: 1, width: "100%" }}>
        <Virtuoso
          ref={virtuosoRef}
          style={{ height: "650px", width: "100%" }}
          data={accumulatedResults}
          overscan={2000}
          // 3. CRUCIAL: Pass the changing state variables into Virtuoso context
          context={{
            selectedIndex,
            setSelectedIndex,
            playingIndex,
            setPlayingIndex,
            dirRootHandle: props.dirRootHandle,
          }}
          components={{
            Scroller: ({ children, ...scrollerProps }) => (
              <div
                {...scrollerProps}
                tabIndex={0} // Allows list container focus context capture
                onKeyDown={(e) => {
                  onKeyDown(e);
                }}
              >
                {children}
              </div>
            ),
          }}
          endReached={loadMore}
          itemContent={renderItem} // Pointing to stable function reference
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
