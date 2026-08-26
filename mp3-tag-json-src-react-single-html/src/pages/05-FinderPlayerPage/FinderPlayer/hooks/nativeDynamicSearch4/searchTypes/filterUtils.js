export function verifyCustomFilter(item, filterConfig) {
  const itemValue = item[filterConfig.key];
  const target = filterConfig.raw.value;

  if (filterConfig.type === "range") {
    const variance = filterConfig.raw.variance || 0;
    const numVal = Number(itemValue);
    return (
      numVal >= Number(target) - variance && numVal <= Number(target) + variance
    );
  }

  if (Array.isArray(itemValue)) {
    return itemValue
      .map((v) => String(v).toLowerCase())
      .includes(String(target).toLowerCase());
  }

  return String(itemValue).toLowerCase() === String(target).toLowerCase();
}
