// filterUtils.js
export function verifyCustomFilter(item, filterConfig) {
  const itemValue = item[filterConfig.key];

  // FIX: Force the user's search query to lowercase right away
  const target = String(filterConfig.raw.value).toLowerCase();

  if (filterConfig.type === "range") {
    const variance = filterConfig.raw.variance || 0;
    const numVal = Number(itemValue);
    return (
      numVal >= Number(filterConfig.raw.value) - variance &&
      numVal <= Number(filterConfig.raw.value) + variance
    );
  }

  // Handle arrays natively (e.g., instruments, tags)
  if (Array.isArray(itemValue)) {
    return itemValue.map((v) => String(v).toLowerCase()).includes(target); // Now comparing lowercase to lowercase!
  }

  // Fallback for flat strings/exact values
  const fallback = String(itemValue).toLowerCase() === target;
  return fallback;
}
