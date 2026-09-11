export function Header(props) {
  return (
    <thead>
      <tr
        style={{
          borderBottom: "2px solid #ccc",
        }}
      >
        {props.headers.map((header) => {
          return (
            <th
              key={header}
              style={{
                padding: "8px",
                fontSize: "18px",
                borderRight: "1px solid #DDD",
                textAlign: "center",
              }}
            >
              {header.slice(0, 3).toUpperCase()}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
// <IconSvg iconName={header} />
