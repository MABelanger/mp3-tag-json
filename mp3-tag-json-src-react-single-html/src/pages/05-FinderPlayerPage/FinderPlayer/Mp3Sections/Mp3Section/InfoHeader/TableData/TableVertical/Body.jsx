export function Body(props) {
  return (
    <tbody>
      <tr>
        {props.dataKeys.map((key, index) => {
          const cellStyle = {
            padding: "5px",
            fontSize: "22px",
            width: "65px",
            borderRight: "1px solid #DDD",
            borderBottom: "1px solid #DDD",
            textAlign: "center",
          };
          return (
            <td key={key} style={cellStyle}>
              {props.result[key]}
            </td>
          );
        })}
      </tr>
    </tbody>
  );
}
