import {
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from "react";
import { Virtuoso } from "react-virtuoso";
import { useReadFile } from "../../../components/ReadWriteDirectory/hooks/useReadFile";
import { DynamicForm } from "../../../components/ui/DynamicForm";
import { Mp3Section } from "./Mp3Sections/Mp3Section";
import { useMp3SectionsCommand } from "./Mp3Sections/hooks/useMp3SectionsCommand";
import { finderStore } from "./hooks/finderStore2";
import { FileNamesForm } from "./FileNamesForm";

export function FinderPlayer(props) {
  const { fileData: settings } = useReadFile(
    props.dirRootHandle,
    "settings.json"
  );
  const virtuosoRef = useRef(null);

  // Subscribe to changes safely. Parent won't re-render on selection shifts!
  const accumulatedResults = useSyncExternalStore(
    finderStore.subscribe,
    finderStore.getAccumulatedResults
  );
  const loading = useSyncExternalStore(
    finderStore.subscribe,
    finderStore.getLoading
  );

  const numberOfSection = accumulatedResults.length - 1;

  // Key navigation hook
  const { onKeyDown } = useMp3SectionsCommand(numberOfSection);

  // Auto-scroll follow layout
  useEffect(() => {
    const unsubscribe = finderStore.subscribe(() => {
      const selectedIndex = finderStore.getSelectedIndex();
      if (virtuosoRef.current) {
        virtuosoRef.current.scrollToIndex({
          index: selectedIndex,
          behavior: "auto",
          align: "center",
        });
      }
    });
    return () => unsubscribe();
  }, []);

  function handleFilterChange(newFilters) {
    console.log("newFilters", newFilters);
    // newFilters = {
    //   ...newFilters,
    //   fileName: [
    //     "norah jones - sunrise.mp3",
    //     //"half moon run - crawl back in (live from the treehouse).mp3",
    //   ],
    // };
    finderStore.applyFilters(newFilters);
    if (virtuosoRef.current) virtuosoRef.current.scrollToIndex({ index: 0 });
  }

  function handleFilteredFileNames(newFilterFileNames) {
    console.log("newFilterFileNames", newFilterFileNames);
    // newFilters = {
    //   ...newFilters,
    //   fileName: [
    //     "norah jones - sunrise.mp3",
    //     //"half moon run - crawl back in (live from the treehouse).mp3",
    //   ],
    // };
    finderStore.applyFilterFileNames(newFilterFileNames);
    if (virtuosoRef.current) virtuosoRef.current.scrollToIndex({ index: 0 });
  }

  // 100% Static Row Renderer
  const renderItem = useCallback(
    (i, result) => {
      if (!result) return <div>Loading track data...</div>;
      return (
        <div style={{ height: "300px" }}>
          <Mp3Section
            index={i}
            result={result}
            dirRootHandle={props.dirRootHandle}
          />
        </div>
      );
    },
    [props.dirRootHandle]
  );

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

  console.log("This will log ON MOUNT and never again!");

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <DynamicForm settings={settings} onChange={handleFilterChange} />

      <FileNamesForm onFilteredFileNames={handleFilteredFileNames} />

      <div style={{ flex: 1, width: "100%" }}>
        <Virtuoso
          ref={virtuosoRef}
          style={{ height: "650px", width: "100%" }}
          data={accumulatedResults}
          overscan={400}
          components={virtuosoComponents}
          endReached={() => finderStore.fetchNextPage(20)}
          itemContent={renderItem}
        />
      </div>

      {loading && <p style={{ textAlign: "center" }}>Loading tracks...</p>}
    </div>
  );
}
