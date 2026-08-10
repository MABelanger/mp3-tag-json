export function getHasBassFilter(bassFilterValue) {
  const hasBassFilter =
    bassFilterValue !== "" &&
    bassFilterValue !== null &&
    bassFilterValue !== undefined;
  return hasBassFilter;
}

export function getBassBound(bassFilterValue) {
  // Calculate Bass boundaries (+-1 range) if filter value exists
  const hasBassFilter = getHasBassFilter(bassFilterValue);

  const targetBassNum = hasBassFilter ? Number(bassFilterValue) : 0;
  const minBassBound = targetBassNum - 1;
  const maxBassBound = targetBassNum + 1;

  return {
    min: minBassBound,
    max: maxBassBound,
  };
}
