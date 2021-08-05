export const getUniqueId = (items) => {
  const _items = JSON.parse(JSON.stringify(items));
  _items.sort(function (a, b) {
    if (a.id > b.id) return -1;
    if (a.id < b.id) return 1;
    return 0;
  });
  return _items[0].id + 1;
};
