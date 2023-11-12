export function sortCollectionBySortApp(items: any[]) {
  const findSortAppFieldName = (fieldData: {
    [key: string]: any;
  }): string | null => {
    for (const key in fieldData) {
      if (key.startsWith("sort-app")) {
        return key;
      }
    }
    return null;
  };

  const sortFieldName =
    items.length > 0 ? findSortAppFieldName(items[0].fieldData) : null;

  if (!sortFieldName) {
    return { sortedItems: items, sortFieldName: null };
  }

  const sortedItems = items.slice().sort((a, b) => {
    const valueA = a.fieldData[sortFieldName] || 0;
    const valueB = b.fieldData[sortFieldName] || 0;
    return valueB - valueA; // Reverse order sorting
  });

  return { sortedItems, sortFieldName };
}
