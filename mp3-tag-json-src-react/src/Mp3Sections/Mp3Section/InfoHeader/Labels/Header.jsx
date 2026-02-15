import { IconSvg } from "./IconSvg";

export function Header(props) {
  return (
    <thead>
      <tr
        style={{
          backgroundColor: "RGB(11, 11, 11)",
          borderBottom: "2px solid #ccc",
        }}
      >
        {props.headers.map((header) => {
          return (
            <th
              key={header}
              style={{
                padding: "8px",
                textAlign: "left",
                fontSize: "18px",
                borderRight: "1px solid white",
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
