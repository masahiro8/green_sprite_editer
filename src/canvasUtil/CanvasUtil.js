export const CanvasUtil = () => {
  const lineConfig = {
    strokeStyle: "red",
    lineWidth: 10
  };
  const shadowCanvasId = "tmpCanvas";
  let id = null;
  let isDrawing = false;
  let pointerPosition = { x: null, y: null };
  let marginSize = { x: 0, y: 0 };
  let Context = null;
  let scaleRate = { x: 1.0, y: 1.0 };
  let clipRect = { minx: 0, miny: 0, maxx: 0, maxy: 0 };

  const init = (canvasId) => {
    id = canvasId;
  };

  const release = () => {
    const shadowCanvas = document.getElementById(shadowCanvasId);
    shadowCanvas.remove();
  };

  const createCropImage = () => {
    // 切り取り範囲
    const crop = {
      left: clipRect.minx,
      top: clipRect.miny,
      width: clipRect.maxx - clipRect.minx,
      height: clipRect.maxy - clipRect.miny
    };
    const target = document.getElementById(id);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.id = shadowCanvasId;
    canvas.width = crop.width;
    canvas.height = crop.height;
    ctx.drawImage(
      target,
      crop.left,
      crop.top,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );
    return {
      base64: canvas.toDataURL("image/png"),
      rect: {
        x: crop.left,
        y: crop.top,
        width: crop.width,
        height: crop.height
      }
    };
  };

  // base64として返す
  const getImage = () => {
    return createCropImage();
  };

  // 描画開始
  const drawStart = () => {
    const target = document.getElementById(id);
    const rect = target.getBoundingClientRect();
    marginSize = { x: rect.x, y: rect.y };
    scaleRate = {
      x: window.innerWidth / rect.width,
      y: window.innerHeight / rect.height
    };
    Context = target.getContext("2d");
    clipRect = {
      minx: rect.width,
      miny: rect.height,
      maxx: 0,
      maxy: 0
    };
    target.addEventListener("mousedown", mouseDown, true);
    target.addEventListener("mouseup", mouseUp, true);
    target.addEventListener("mousemove", mouseMove, true);
  };

  // 描画終了
  const drawEnd = () => {
    isDrawing = false;
    const target = document.getElementById(id);
    target.removeEventListener("mousedown", mouseDown, true);
    target.removeEventListener("mouseup", mouseUp, true);
    target.removeEventListener("mousemove", mouseMove, true);
  };

  const convertPointer = (event) => {
    const p = {
      x: event.clientX * scaleRate.x,
      y: event.clientY * scaleRate.y
    };
    return {
      x: p.x - marginSize.x,
      y: p.y - marginSize.y
    };
  };

  const mouseDown = (event) => {
    isDrawing = true;
    pointerPosition = convertPointer(event);
    Context.beginPath();
    Context.strokeStyle = lineConfig.strokeStyle;
    Context.lineWidth = lineConfig.lineWidth;
    Context.moveTo(pointerPosition.x, pointerPosition.y);
  };

  const mouseUp = (event) => {
    isDrawing = false;
    pointerPosition = convertPointer(event);
  };

  const mouseMove = (event) => {
    pointerPosition = convertPointer(event);
    if (isDrawing) {
      Context.lineTo(pointerPosition.x, pointerPosition.y);
      Context.stroke();
      clipRect = {
        minx:
          clipRect.minx > pointerPosition.x ? pointerPosition.x : clipRect.minx,
        miny:
          clipRect.miny > pointerPosition.y ? pointerPosition.y : clipRect.miny,
        maxx:
          clipRect.maxx < pointerPosition.x ? pointerPosition.x : clipRect.maxx,
        maxy:
          clipRect.maxy < pointerPosition.y ? pointerPosition.y : clipRect.maxy
      };
      console.log(pointerPosition.x, clipRect.minx, clipRect.maxx);
    }
  };

  return {
    init,
    release,
    getImage,
    drawStart,
    drawEnd
  };
};
