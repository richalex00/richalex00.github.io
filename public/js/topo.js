// Pixel topo map: contour lines at low resolution, scaled up. Draws on every
// <canvas data-topo> and keeps the text named by data-topo-clear readable,
// like a label on a real map. New hills on every page load.
(function () {
  // wait for the pixel font so the gap around the text is measured correctly
  document.fonts.ready.then(() => document.querySelectorAll("canvas[data-topo]").forEach(draw));

  function draw(cv) {
    const hero = cv.parentElement;
    const CELL = 5;
    const W = Math.ceil(hero.clientWidth / CELL), H = Math.ceil(hero.clientHeight / CELL);
    cv.width = W; cv.height = H;
    const x = cv.getContext("2d");
    const hills = Array.from({ length: 7 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: 18 + Math.random() * 40, a: Math.random() < 0.3 ? -1 : 1 }));
    const f = (i, j) => hills.reduce((s, k) => s + k.a * Math.exp(-((i - k.x) ** 2 + (j - k.y) ** 2) / (2 * k.r * k.r)), 0);
    const field = []; for (let j = 0; j < H; j++) { field[j] = []; for (let i = 0; i < W; i++) field[j][i] = f(i, j); }
    const STEP = 0.17, band = (v) => Math.floor(v / STEP);

    // the clear zone: union of the labelled elements' boxes, plus padding
    const hr = hero.getBoundingClientRect(), pad = 14;
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

    for (let j = 0; j < H - 1; j++) for (let i = 0; i < W - 1; i++) {
      const b = band(field[j][i]);
      if (b === band(field[j][i + 1]) && b === band(field[j + 1][i])) continue;
      if (clear && i > clear.x0 && i < clear.x1 && j > clear.y0 && j < clear.y1) continue;
      const index = ((b % 5) + 5) % 5 === 0;
      x.fillStyle = index ? "rgba(79,125,115,0.42)" : "rgba(79,125,115,0.18)";
      x.fillRect(i, j, 1, 1);
    }
  }
})();
