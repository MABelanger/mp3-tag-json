export function Header(props) {
  return (
    <thead>
      <tr
        style={{
          backgroundColor: "RGB(11, 11, 11)",
          borderBottom: "2px solid #ccc",
        }}
      >
        {props.headers.map((header) => (
          <th
            key={header}
            style={{ padding: "8px", textAlign: "left", fontSize: "14px" }}
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
}
