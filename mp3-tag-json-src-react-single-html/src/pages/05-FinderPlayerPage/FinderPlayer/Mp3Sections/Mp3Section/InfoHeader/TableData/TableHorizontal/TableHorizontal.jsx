import { Note } from "./Note";

export function TableHorizontal(props) {
  return (
    <div style={{ overflowX: "auto" }}>
      {/* {mp3TagJson["note"] && <Note note={mp3TagJson["note"]} />} */}
      <table
        style={{
          width: "100%",
          border: "none",
          tableLayout: "fixed", // Forces strict adherence to your widths/heights
          borderCollapse: "collapse", // Removes hidden spacing between rows
        }}
      >
        {props.dataKeys.map((dataKey) => {
          const value = Array.isArray(props.result[dataKey])
            ? props.result[dataKey].join(" ")
            : props.result[dataKey];
          return (
            <tr key={dataKey} style={{ height: "18px" }}>
              <th
                style={{
                  padding: "0px 8px", // 0px top/bottom padding so it doesn't stretch vertically
                  width: "95px",
                  fontSize: "18px", // Decreased to fit inside a 18px box
                  lineHeight: "1", // Prevents text line-height from stretching the row
                  textAlign: "left",
                  height: "18px",
                  whiteSpace: "nowrap", // Prevents headers from wrapping and creating a second line
                  overflow: "hidden",
                }}
              >
                {dataKey}
              </th>
              <td
                style={{
                  height: "18px",
                  padding: "0px 8px", // 0px top/bottom padding
                  fontSize: "18px",
                  lineHeight: "1",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis", // Adds '...' if the data value is too long
                }}
              >
                {value}
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  );
}
