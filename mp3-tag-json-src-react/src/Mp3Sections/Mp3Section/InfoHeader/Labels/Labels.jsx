import { Body } from "./Body";
import { Header } from "./Header";
import { Note } from "./Note";

export function Labels(props) {
  const { mp3TagJson } = props;
  // Define headers for easy maintenance
  const dataKeys = [
    "bpm",
    "expention",
    "festive",
    "contact",
    "rythmic",
    "bass",
    "curve",
    "instrumentOrTypes",
  ];

  return (
    <div style={{ overflowX: "auto", border: "1px solid #ddd" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "sans-serif",
        }}
      >
        <Header headers={dataKeys} />
        <Body dataKeys={dataKeys} mp3TagJson={mp3TagJson} />
      </table>
      <Note note={mp3TagJson["note"]} />
    </div>
  );
}
