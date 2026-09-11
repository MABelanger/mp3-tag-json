import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Virtuoso } from "react-virtuoso";
import { useReadFile } from "../../../components/ReadWriteDirectory/hooks/useReadFile";
import { useSearchIndexDb } from "./hooks/useSearchIndexDb11";
import { DynamicForm } from "../../../components/ui/DynamicForm";
import { Mp3Section } from "./Mp3Sections/Mp3Section";
import { useMp3SectionsCommand } from "./Mp3Sections/hooks/useMp3SectionsCommand";

export function FinderPlayer(props) {
  // Fetch paginated database items
  const { setPage, setFilters, filters, results, loading, error, hasMore } =
    useSearchIndexDb(20);

  // Read configuration settings
  const { fileData: settings } = useReadFile(
    props.dirRootHandle,
    "settings.json"
  );

  // Core array containing state-decorated tracks
  const [accumulatedResults, setAccumulatedResults] = useState([]);
  const numberOfSection = accumulatedResults.length - 1;
  const [playingIndex, setPlayingIndex] = useState(0);

  // Custom keyboard hook command manager
  const { onKeyDown, selectedIndex, setSelectedIndex } =
    useMp3SectionsCommand(numberOfSection);

  const virtuosoRef = useRef(null);

  // 1. CLEAR ACCUMULATED DATA: Wipes everything fresh when search queries change
  useEffect(() => {
    setAccumulatedResults([]);
    setPage(1);
    if (virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({ index: 0 });
    }
  }, [filters, setPage]);

  // 2. DATA APPENDER: Decorates newly received chunks from IndexedDB with state flags
  useEffect(() => {
    if (results && results.length > 0) {
      setAccumulatedResults((prevData) => {
        const existingIds = new Set(prevData.map((item) => item.id));
        const uniqueNewResults = results.filter(
          (item) => !existingIds.has(item.id)
        );

        // Map current positions dynamically so rows initialize correctly
        const updatedNewResults = uniqueNewResults.map((item, idx) => {
          const absoluteIndex = prevData.length + idx;
          return {
            ...item,
            isActive: absoluteIndex === selectedIndex,
            isPlaying: absoluteIndex === playingIndex,
          };
        });

        return [...prevData, ...updatedNewResults];
      });
    }
  }, [results]); // Intentionally isolated from index tracking to prevent duplicate append cycles

  // 3. SELECTION TRACKER: Decorates selection active flags directly onto item references.
  useEffect(() => {
    setAccumulatedResults((prevData) =>
      prevData.map((item, idx) => {
        const shouldBeActive = idx === selectedIndex;
        if (item.isActive === shouldBeActive) return item;
        return { ...item, isActive: shouldBeActive };
      })
    );

    if (virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index: selectedIndex,
        behavior: "auto", // 'auto' yields perfect frame rates compared to 'smooth' on rapid keyboard holds
        align: "center",
      });
    }
  }, [selectedIndex]);

  // 4. PLAYBACK TRACKER: Decorates playback active flags directly onto item references.
  useEffect(() => {
    setAccumulatedResults((prevData) =>
      prevData.map((item, idx) => {
        const shouldBePlaying = idx === playingIndex;
        if (item.isPlaying === shouldBePlaying) return item;
        return { ...item, isPlaying: shouldBePlaying };
      })
    );
  }, [playingIndex]);

  // Infinite scroll offset trigger calculation
  const loadMore = () => {
    if (hasMore && !loading) {
      setPage((currentPage) => currentPage + 1);
    }
  };

  // 5. ATOMIC ROW DISPATCHER: Reference address remains completely locked.
  // We only pass pure primitive boolean states down, protecting the rows from outer renders.
  const renderItem = useCallback(
    (i, result) => {
      if (!result) return <div>Loading track data...</div>;
      return (
        <div style={{ height: "300px" }}>
          <Mp3Section
            index={i}
            result={result}
            isActive={result.isActive} // Primitive boolean prop
            isPlaying={result.isPlaying} // Primitive boolean prop
            setPlayingIndex={setPlayingIndex}
            setSelectedIndex={setSelectedIndex}
            dirRootHandle={props.dirRootHandle}
          />
        </div>
      );
    },
    [setPlayingIndex, setSelectedIndex, props.dirRootHandle]
  );

  // 6. STABILIZED SCROLLER VIEWPORT CONTAINER
  const virtuosoComponents = useMemo(
    () => ({
      Scroller: ({ children, ...scrollerProps }) => (
        <div {...scrollerProps} tabIndex={0} onKeyDown={onKeyDown}>
          {children}
        </div>
      ),
    }),
    [onKeyDown]
  );

  console.log("render all"); // This is fine if it logs; your itemContent below is protected!

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <DynamicForm settings={settings} onChange={setFilters} />

      <div style={{ flex: 1, width: "100%" }}>
        <Virtuoso
          ref={virtuosoRef}
          style={{ height: "650px", width: "100%" }}
          data={accumulatedResults}
          overscan={400} // Keeps a few elements loaded above/below view for fast scrolling
          components={virtuosoComponents}
          endReached={loadMore}
          itemContent={renderItem}
        />
      </div>

      {loading && <p style={{ textAlign: "center" }}>Loading tracks...</p>}
    </div>
  );
}
