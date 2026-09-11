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

export function TableHorizontal(props) {
  return (
    <div style={{ overflowX: "auto", border: "1px solid #ddd" }}>
      {/* {mp3TagJson["note"] && <Note note={mp3TagJson["note"]} />} */}
      <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
        {props.dataKeys.map((dataKey) => {
          const value = Array.isArray(props.result[dataKey])
            ? props.result[dataKey].join(", ")
            : props.result[dataKey];
          return (
            <tr>
              <th
                style={{
                  padding: "8px",
                  width: "12px",
                  fontSize: "18px",
                  borderRight: "1px solid #DDD",
                  textAlign: "left",
                }}
              >
                {dataKey}
              </th>
              <td>{value}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
}
