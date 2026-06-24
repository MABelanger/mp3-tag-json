export function Body(props) {
  const lastElementIndex = props.dataKeys.length - 1;
  return (
    <tbody>
      <tr>
        {props.dataKeys.map((key, index) => {
          const cellStyle = {
            padding: "5px",
            fontSize: "22px",
            width: index == lastElementIndex ? "300px" : "65px",
            borderRight: "1px solid #DDD",
            borderBottom: "1px solid #DDD",
            textAlign: "center",
          };
          return (
            <td key={key} style={cellStyle}>
              {props.mp3TagJson[key]}
            </td>
          );
        })}
      </tr>
    </tbody>
  );
}
