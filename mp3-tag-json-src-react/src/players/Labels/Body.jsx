const cellStyle = {
  padding: "10px",
  fontSize: "13px",
  whiteSpace: "nowrap", // Prevents values from wrapping awkwardly
  width: "200px",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export function Body(props) {
  return (
    <tbody>
      <tr>
        {props.dataKeys.map((key) => (
          <td key={key} style={cellStyle}>
            {props.mp3TagJson[key]}
          </td>
        ))}
      </tr>
    </tbody>
  );
}
