import { useEffect, useState } from "react";
import { useMp3TagJson } from "./hooks/useMp3TagJson";
import { Mp3Sections } from "./Mp3Sections";
import { Header } from "./Header";
import themeStyles from "./AppTheme.module.css";
import styles from "./App.module.css";

export function FinderPlayer(props) {
  console.log("props.jsonTracks", props.jsonTracks);
  return (
    <div>
      {props.jsonTracks && props.jsonTracks[0].path}
      <pre>
        TODO : <br />
        * Take all list and filter json. Refilter the scanned file ?<br />
        * From that json remove .json to get the .mp3 <br />
        * Find a way to concatenate all json to do the search <br />
        * From that result, pass array obj of (linkMp3 + linkJson)
        <br />
        * Result maximum 50 results ?<br />
      </pre>
    </div>
  );
}
// export function FinderPlayer(props) {
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
