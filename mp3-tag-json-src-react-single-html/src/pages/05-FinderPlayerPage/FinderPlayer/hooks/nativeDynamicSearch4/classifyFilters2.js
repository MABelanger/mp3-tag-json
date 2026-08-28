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
      const isNum = !isNaN(filter.value);
      // FIX: If the search term is a string, force it lowercase to match the normalized index keys
      const targetVal = isNum
        ? Number(filter.value)
        : String(filter.value).toLowerCase();
      console.log("---targetVal", targetVal);
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
