export function Header(props) {
  return (
    <thead>
      <tr
        style={{
          backgroundColor: "#f4f4f4",
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
