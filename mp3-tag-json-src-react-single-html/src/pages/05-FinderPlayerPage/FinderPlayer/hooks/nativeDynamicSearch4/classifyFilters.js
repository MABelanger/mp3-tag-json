/**
 * Classifies and maps user custom filters at runtime into indexed and unindexed sets.
 */
export function classifyFilters({ customFilters, indexedKeys }) {
  const activeIndexedFilters = [];
  const activeUnindexedFilters = [];

  for (const filter of customFilters) {
    if (
      filter.value === "" ||
      filter.value === null ||
      filter.value === undefined
    )
      continue;

    const isIndexed = indexedKeys.has(filter.key);
    let keyRange;

    if (filter.type === "range") {
      const variance = filter.variance || 0;
      const numVal = Number(filter.value);
      keyRange = IDBKeyRange.bound(numVal - variance, numVal + variance);
    } else {
      // Ensure type match (convert string to number if index is numeric)
      const targetVal = isNaN(filter.value)
        ? filter.value
        : Number(filter.value);
      keyRange = IDBKeyRange.only(targetVal);
    }

    const compiledFilter = {
      key: filter.key,
      type: filter.type,
      range: keyRange,
      raw: filter,
    };

    if (isIndexed) {
      activeIndexedFilters.push(compiledFilter);
    } else {
      activeUnindexedFilters.push(compiledFilter);
    }
  }

  return { activeIndexedFilters, activeUnindexedFilters };
}
