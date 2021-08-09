export const getUniqueId = (items) => {
  if (!items || items.length === 0) return 1;
  const _items = JSON.parse(JSON.stringify(items));
  _items.sort(function (a, b) {
    if (!a || !b) return 0;
    if (a.id > b.id) return -1;
    if (a.id < b.id) return 1;
    return 0;
  });
  console.log("unique", _items[0].id);
  return _items[0].id + 1;
};

export const getMaxZindex = (items) => {
  let z = 0;
  items.forEach((item) => {
    if ("z_index" in item.transform && z < item.transform.z_index) {
      z = item.transform.z_index;
    }
  });
  return z;
};
