function isConditionTrimed(attribute, min, max) {
  const attributeTrim = attribute.replace(/[+-]/g, "");
  return attributeTrim >= min && attributeTrim <= max;
}

export function getfilteredItem(items, attributeName, min, max) {
  return items.filter((item) => {
    const attribute = item[attributeName];
    return isConditionTrimed(attribute, min, max);
  });
}
