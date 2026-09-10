import { Body } from "./Body";
import { Header } from "./Header";
import { Note } from "./Note";

function isObject(variable) {
  return (
    typeof variable === "object" &&
    variable !== null &&
    !Array.isArray(variable)
  );
}

export function Labels(props) {
  // Define headers for easy maintenance
  // const dataKeys = [
  //   "bpm",
  //   "expention",
  //   "festive",
  //   "contact",
  //   "rythmic",
  //   "bass",
  //   "curve",
  //   "instrumentOrTypes",
  // ];

  const dataKeys = Object.keys(props.result).filter((key) => {
    console.log("h3llo");
    const value = props.result[key];
    console.log("hi");
    return key !== "mp3Handle" && !Array.isArray(value) && !isObject(value);
  });

  console.log("=dataKeys", dataKeys);

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
        <Body dataKeys={dataKeys} result={props.result} />
      </table>
      {/* {mp3TagJson["note"] && <Note note={mp3TagJson["note"]} />} */}
    </div>
  );
}
