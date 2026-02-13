const cellStyle = {
  padding: "5px",
  fontSize: "18px",
  width: "200px",
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
