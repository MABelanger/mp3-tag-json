import { Body } from "./Body";
import { Header } from "./Header";

export function Labels(props) {
  const { mp3TagJson } = props;
  // Define headers for easy maintenance
  const dataKeys = [
    "bpm",
    "instrumentOrTypes",
    "expention",
    "festive",
    "contact",
    "rythmic",
    "bass",
    "curve",
    "note",
  ];

  return (
    <div
      style={{ overflowX: "auto", margin: "20px 0", border: "1px solid #ddd" }}
    >
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
    </div>
  );
}
