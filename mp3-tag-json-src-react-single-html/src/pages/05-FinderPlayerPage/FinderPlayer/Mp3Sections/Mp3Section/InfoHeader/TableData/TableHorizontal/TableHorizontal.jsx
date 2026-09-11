import { Body } from "./Body";
import { Header } from "./Header";
import { Note } from "./Note";

function isValueVerticalTable(value) {
  const isString = typeof value === "string";
  const isArray = Array.isArray(value);

  return isString || isArray;
}
function isObject(variable) {
  return (
    typeof variable === "object" &&
    variable !== null &&
    !Array.isArray(variable)
  );
}

export function TableData(props) {
  const dataKeys = Object.keys(props.result).filter((key) => {
    const value = props.result[key];
    return (
      key !== "mp3Handle" &&
      key !== "id" &&
      !Array.isArray(value) &&
      !isObject(value)
    );
  });

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
      <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
        <tr>
          <th>Name</th>
          <td>Alex</td>
          <td>Jordan</td>
          <td>Taylor</td>
        </tr>

        <tr>
          <th>Role</th>
          <td>Developer</td>
          <td>Designer</td>
          <td>Manager</td>
        </tr>
      </table>
    </div>
  );
}
