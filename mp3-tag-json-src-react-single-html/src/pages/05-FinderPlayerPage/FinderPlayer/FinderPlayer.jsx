import { useState } from "react";

import { useSearchIndexDb } from "./hooks/useSearchIndexDb5";

export function FinderPlayer(props) {
  console.log("props.jsonTracks", props.jsonTracks);

  const { setPage, setFilters, filters, results, loading, error, hasMore } =
    useSearchIndexDb(20);

  console.log("results", results);
  const handleFilterChangeInputText = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChangeArrayText = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: ["voix", "darbouka2"] }));
  };

  return (
    <div>
      <h3>Track Explorer</h3>
      <input
        type="number"
        name="bpm"
        value={filters.bpm}
        onChange={handleFilterChangeInputText}
        placeholder="BPM"
      />
      <input
        type="text"
        name="instruments"
        value={filters.instruments}
        onChange={handleFilterChangeArrayText}
        placeholder="Instrument Key"
      />

      {loading && <p>Reading from IndexedDB...</p>}

      <ul>
        {results.map((track) => (
          <li key={track.id}>
            BPM: {track.bpm} | Instruments:{" "}
            {Array.isArray(track.instruments)
              ? track.instruments.join(",")
              : track.instruments}
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
