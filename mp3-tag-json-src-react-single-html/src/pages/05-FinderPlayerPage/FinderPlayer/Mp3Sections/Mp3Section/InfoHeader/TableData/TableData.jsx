import { TableVertical } from "./TableVertical";

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValueHorizontalTable(value) {
  const isString = typeof value === "string";
  const isArray = Array.isArray(value);

  return isString || isArray;
}

function getVerticalDataKeys(result) {
  const dataKeys = Object.keys(result).filter((key) => {
    const value = result[key];
    return (
      key !== "mp3Handle" &&
      key !== "id" &&
      !isValueHorizontalTable(value) &&
      !isObject(value)
    );
  });
  return dataKeys;
}

export function TableData(props) {
  const verticalDataKeys = getVerticalDataKeys(props.result);
  return (
    <div>
      <TableVertical dataKeys={verticalDataKeys} result={props.result} />
    </div>
  );
}
