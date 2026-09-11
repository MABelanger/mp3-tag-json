import { Body } from "./Body";
import { Header } from "./Header";

export function TableVertical(props) {
  return (
    <div style={{ overflowX: "auto", border: "1px solid #ddd" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "sans-serif",
        }}
      >
        <Header headers={props.dataKeys} />
        <Body dataKeys={props.dataKeys} result={props.result} />
      </table>
    </div>
  );
}
