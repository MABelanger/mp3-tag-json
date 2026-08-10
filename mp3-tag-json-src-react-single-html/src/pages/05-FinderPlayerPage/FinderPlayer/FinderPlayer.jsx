import { useState } from "react";

import { useSearchIndexDb } from "./hooks/useSearchIndexDb8";
import { RangeDropdown } from "./ui-form/RangeDropdown";
import { getArrayFromHashtag } from "./utils/hashTagSearchUtils3";

export function FinderPlayer(props) {
  console.log("props.jsonTracks", props.jsonTracks);
  const rangeConfig = { min: 0, max: 5 };

  const [inputFilters, setInputFilters] = useState({
    bpm: "",
    instruments: "", // #hashtag
    cues: "", // #hashtag
    bass: "",
  });

  const { setPage, setFilters, filters, results, loading, error, hasMore } =
    useSearchIndexDb(20);

  console.log("results", results);

  const handleFilterChangeInputText = (e) => {
    const { name, value } = e.target;
    console.log("name, value", name, value);
    setInputFilters((prev) => ({ ...prev, [name]: value }));
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // 2. Allow any raw string modifications during active typing
  const handleFilterChangeArrayText = (e) => {
    const { name, value } = e.target;
    setInputFilters((prev) => ({ ...prev, [name]: value }));
    setFilters((prev) => ({ ...prev, [name]: getArrayFromHashtag(value) }));
  };

  return (
    <div>
      <h3>Track Explorer</h3>
      <input
        type="number"
        name="bpm"
        value={inputFilters.bpm}
        onChange={handleFilterChangeInputText}
        placeholder="BPM"
      />
      <RangeDropdown
        title="bass"
        name="bass"
        range={rangeConfig}
        value={filters.bass}
        onChange={handleFilterChangeInputText}
      />
      <input
        type="text"
        name="instruments"
        value={inputFilters.instruments}
        onChange={handleFilterChangeArrayText}
        placeholder="Instruments #"
      />
      <input
        type="text"
        name="cues"
        value={inputFilters.cues}
        onChange={handleFilterChangeArrayText}
        placeholder="Cues #"
      />

      {loading && <p>Reading from IndexedDB...</p>}

      <ul>
        {results.map((track) => (
          <li key={track.id}>
            BPM: {track.bpm} | Instruments:{" "}
            {Array.isArray(track.instruments)
              ? track.instruments.join(",")
              : track.instruments}
            | cues:{" "}
            {Array.isArray(track.cues) ? track.cues.join(",") : track.cues}
          </li>
        ))}
      </ul>
    </div>
  );

  // return (
  //   <div>
  //     {props.jsonTracks && props.jsonTracks[0].path}
  //     <pre>
  //       TODO : <br />
  //       * Take all list and filter json. Refilter the scanned file ?<br />
  //       * From that json remove .json to get the .mp3 <br />
  //       * Find a way to concatenate all json to do the search <br />
  //       * From that result, pass array obj of (linkMp3 + linkJson)
  //       <br />
  //       * Result maximum 50 results ?<br />
  //     </pre>
  //   </div>
  // );
}
// export function BuildDatabasePage(props) {
//   const { mp3TagJson, isLoading, error } = useMp3TagJson();

//   const [isDark, setIsDark] = useState(false);

//   useEffect(() => {
//     const theme = isDark ? themeStyles.darkTheme : themeStyles.lightTheme;

//     document.body.classList.remove(
//       themeStyles.darkTheme,
//       themeStyles.lightTheme
//     );
//     document.body.classList.add(theme);
//   }, [isDark]);

//   if (isLoading) {
//     return <div>loading mp3-tag.json</div>;
//   }

//   if (error) {
//     return <pre>{error}</pre>;
//   }

//   // div style={{ backgroundColor: "#1E1E1E", color: "#DDD" }}>
//   return (
//     <div className={styles.genericText}>
//       <Header />
//       <Mp3Sections
//         mp3Tracks={props.mp3Tracks}
//         dirRootHandle={props.dirRootHandle}
//       />
//     </div>
//   );
// }
