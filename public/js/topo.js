// Pixel topo map: contour lines at low resolution, scaled up. Draws on every
// <canvas data-topo> and keeps the text named by data-topo-clear readable,
// like a label on a real map: lines fade out as they near the text instead of
// stopping at a hard edge. New hills on every page load.
(function () {
  // wait for the pixel font so the gap around the text is measured correctly
  document.fonts.ready.then(() => document.querySelectorAll("canvas[data-topo]").forEach(draw));

  function draw(cv) {
    const hero = cv.parentElement;
    const CELL = 5;
    const W = Math.ceil(hero.clientWidth / CELL), H = Math.ceil(hero.clientHeight / CELL);
    const hills = Array.from({ length: 7 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: 18 + Math.random() * 40, a: Math.random() < 0.3 ? -1 : 1 }));
    // height field, already cut into contour bands (flat typed array, no per-pixel closures)
    const STEP = 0.17, FADE = 16, band = new Int32Array(W * H);
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
      let s = 0;
      for (const k of hills) s += k.a * Math.exp(-((i - k.x) ** 2 + (j - k.y) ** 2) / (2 * k.r * k.r));
      band[j * W + i] = Math.floor(s / STEP);
    }

    // the clear zone: union of the labelled elements' boxes, plus a little padding
    const hr = hero.getBoundingClientRect(), pad = 6;
    let box = null;
    hero.querySelectorAll(cv.dataset.topoClear || "h1").forEach((el) => {
      const r = el.getBoundingClientRect();
      box = box ? { l: Math.min(box.l, r.left), r: Math.max(box.r, r.right), t: Math.min(box.t, r.top), b: Math.max(box.b, r.bottom) }
                : { l: r.left, r: r.right, t: r.top, b: r.bottom };
    });
    const clear = box && {
      x0: (box.l - hr.left - pad) / CELL, x1: (box.r - hr.left + pad) / CELL,
      y0: (box.t - hr.top - pad) / CELL, y1: (box.b - hr.top + pad) / CELL,
    };

    cv.width = W; cv.height = H; // after the layout reads above, so they don't force a reflow
    const x = cv.getContext("2d");
    // write the pixels straight into one ImageData: a single upload instead of a fillRect per pixel
    const img = x.createImageData(W, H), d = img.data;
    for (let j = 0; j < H - 1; j++) for (let i = 0; i < W - 1; i++) {
      const k = j * W + i, b = band[k];
      if (b === band[k + 1] && b === band[k + W]) continue;
      let f = 1;
      if (clear) { // fade with distance from the text: gone inside the box, full strength FADE cells out
        const dx = Math.max(clear.x0 - i, 0, i - clear.x1), dy = Math.max(clear.y0 - j, 0, j - clear.y1);
        const t = Math.min(1, Math.hypot(dx, dy) / FADE);
        if (t === 0) continue;
        f = t * t * (3 - 2 * t); // smoothstep, so the fade has no visible start or end
      }
      const o = k * 4, index = ((b % 5) + 5) % 5 === 0;
      d[o] = 79; d[o + 1] = 125; d[o + 2] = 115; d[o + 3] = (index ? 107 : 46) * f; // alpha 0.42 / 0.18 at full strength
    }
    x.putImageData(img, 0, 0);
  }
})();
