import { TableHorizontal } from "./TableHorizontal";
import { TableVertical } from "./TableVertical";

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValueHorizontalTable(value) {
  const isString = typeof value === "string";
  const isArray = Array.isArray(value);

  return isString || isArray;
}

function isKeyToAvoid(key) {
  return key == "mp3Handle" || key == "id" || key == "mp3Path";
}

function getVerticalDataKeys(result) {
  const dataKeys = Object.keys(result).filter((key) => {
    const value = result[key];
    return (
      !isKeyToAvoid(key) && !isValueHorizontalTable(value) && !isObject(value)
    );
  });
  return dataKeys;
}

function getHorizontalDataKeys(result) {
  const dataKeys = Object.keys(result).filter((key) => {
    const value = result[key];
    return (
      !isKeyToAvoid(key) && isValueHorizontalTable(value) && !isObject(value)
    );
  });
  return dataKeys;
}

export function TableData(props) {
  const verticalDataKeys = getVerticalDataKeys(props.result);
  const horizontalDataKeys = getHorizontalDataKeys(props.result);
  return (
    <div>
      <TableVertical dataKeys={verticalDataKeys} result={props.result} />
      <TableHorizontal dataKeys={horizontalDataKeys} result={props.result} />
    </div>
  );
}
