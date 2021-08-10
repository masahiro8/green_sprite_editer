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

export const toDataURL = (url) => {
  fetch(url)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );
};

export const toDataURLCanvas = (url) => {
  return new Promise((resolved) => {
    let img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      let canvas = document.createElement("CANVAS");
      let ctx = canvas.getContext("2d");
      canvas.height = this.naturalHeight;
      canvas.width = this.naturalWidth;
      ctx.drawImage(this, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      resolved(dataURL);
    };
    img.src = url;
  });
};
