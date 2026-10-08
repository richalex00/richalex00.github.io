// Mining: click the page margins to strike them like a block in Terraria. Each hit leaves a crack, kicks up dust and
// throws chunks of rock that tumble down and pile up on the dotted ground at
// the foot of the page. On the contour map it digs a real crater: the lines
// you hit become the rubble. Same 5px grid as the map. Off on narrow screens
// and with reduced motion.
(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const hero = document.querySelector(".hero"), map = hero && hero.querySelector("canvas[data-topo]");
  const col = document.querySelector("main.col"), name = hero && hero.querySelector("h1");
  const floor = document.querySelector(".dither"); // the dotted band at the foot of the page is the ground
  if (!map || !col) return;
  const CELL = 5, GAP = 28, G = 1100, PILE_MAX = 16, ROCK = "79,125,115", INK = "34,48,44";

  const cv = document.createElement("canvas");
  cv.setAttribute("aria-hidden", "true");
  cv.style.cssText = "position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:0;image-rendering:pixelated";
  document.body.prepend(cv);
  const x = cv.getContext("2d");
  let W, H, colL, colR, groundY = 0, img = null, running = false, last = 0, queued = false, drawn = false;
  let rocks = [], dust = [], cracks = [];
  const pile = new Map(); // cell column -> alphas, bottom first

  function size() {
    W = innerWidth; H = innerHeight;
    cv.width = Math.ceil(W / CELL); cv.height = Math.ceil(H / CELL) + 1;
    drawn = false; // resizing clears the canvas
    measure();
  }
  // layout reads, cached: only redone when the page's size changes, never per frame
  function measure() {
    const r = col.getBoundingClientRect();
    colL = r.left - GAP; colR = r.right + GAP;
    groundY = floor ? scrollY + floor.getBoundingClientRect().top + floor.offsetHeight * 0.2 : document.documentElement.scrollHeight;
  }
  const inGutter = (px) => px < colL || px > colR;
  function minable(e) {
    if (!inGutter(e.clientX) || e.target.closest("a, button, summary, input, dialog, .clock") || document.querySelector("dialog[open]")) return false;
    if (name) { const r = name.getBoundingClientRect(); if (e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom) return false; }
    return true;
  }
  const rnd = (a, b) => a + Math.random() * (b - a);

  function strike(px, py) { // page coordinates
    // crack: a few short pixel rays from the impact, fading out over a few seconds
    const rays = [];
    for (let k = 0; k < 4 + (Math.random() * 3 | 0); k++) {
      const a = rnd(0, 6.283), len = 2 + (Math.random() * 3 | 0);
      for (let s = 1; s <= len; s++) rays.push([Math.round(Math.cos(a) * s), Math.round(Math.sin(a) * s)]);
    }
    cracks.push({ x: px, y: py, rays, born: performance.now() });

    // on the map: dig a crater and throw the real line pixels
    const fromMap = crater(px, py);
    const n = fromMap ? Math.min(3, 7 - fromMap) : 4 + (Math.random() * 4 | 0);
    for (let k = 0; k < n; k++) throwRock(px, py, 0.62);
    for (let k = 0; k < 10; k++) dust.push({ x: px, y: py, vx: rnd(-140, 140), vy: rnd(-170, 10), life: rnd(0.35, 0.7), age: 0 });
    if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
  }
  function throwRock(px, py, alpha, cells) {
    const shapes = [[[0, 0]], [[0, 0], [1, 0]], [[0, 0], [0, 1]], [[0, 0], [1, 0], [0, 1]], [[0, 0], [1, 0], [1, 1], [0, 1]]];
    rocks.push({
      x: px, y: py, vx: rnd(-110, 110), vy: rnd(-330, -120), alpha,
      cells: cells || shapes[Math.random() * shapes.length | 0], turn: rnd(0.08, 0.2), born: performance.now(), bounced: false,
    });
  }
  function crater(px, py) {
    const hb = hero.getBoundingClientRect(), top = hb.top + scrollY;
    if (py < top || py > top + hb.height) return 0;
    const mx = map.getContext("2d"), w = map.width, h = map.height, sx = hb.width / w, sy = hb.height / h;
    img = img || mx.getImageData(0, 0, w, h).data;
    const ci = Math.round((px - hb.left) / sx), cj = Math.round((py - top) / sy);
    let found = 0;
    for (let dj = -3; dj <= 3; dj++) for (let di = -3; di <= 3; di++) {
      const i = ci + di, j = cj + dj, k = (j * w + i) * 4 + 3;
      if (di * di + dj * dj > 10 || i < 0 || j < 0 || i >= w || j >= h || !img[k]) continue;
      if (inGutter(hb.left + i * sx)) {
        mx.clearRect(i, j, 1, 1);
        if (found < 6 && Math.random() < 0.6) { throwRock(hb.left + i * sx, top + j * sy, Math.min(0.75, img[k] / 255 + 0.3), [[0, 0]]); found++; }
        img[k] = 0;
      }
    }
    return found;
  }

  const height = (c) => (pile.get(c) || []).length;
  function settle(c, a) { // roll downhill while a neighbour is 2+ cells lower, then stack
    for (let guard = 0; guard < 24; guard++) {
      const here = height(c), okL = height(c - 1) < here - 1 && inGutter((c - 1) * CELL), okR = height(c + 1) < here - 1 && inGutter((c + 1) * CELL);
      if (okL && okR) c += Math.random() < 0.5 ? -1 : 1; else if (okL) c--; else if (okR) c++; else break;
    }
    if (height(c) >= PILE_MAX) return;
    if (!pile.has(c)) pile.set(c, []);
    pile.get(c).push(a);
  }
  const ROCK_RGB = `rgb(${ROCK})`, INK_RGB = `rgb(${INK})`;
  // one fixed colour per pass; alpha via globalAlpha instead of a new rgba() string per pixel
  let top = 0;
  const dot = (px, py, a) => { x.globalAlpha = a; x.fillRect(Math.round(px / CELL), Math.round((py - top) / CELL), 1, 1); };

  function frame(t) {
    const dt = Math.min(0.05, (t - last) / 1000); last = t;
    top = scrollY;
    const ground = (c) => groundY - height(c) * CELL;
    if (drawn) x.clearRect(0, 0, cv.width, cv.height); // nothing on it: skip the clear

    x.fillStyle = INK_RGB;

    cracks = cracks.filter((c) => {
      const age = (t - c.born) / 1000; if (age > 5) return false;
      const a = 0.7 * Math.min(1, (5 - age) / 2);
      for (const [i, j] of c.rays) dot(c.x + i * CELL, c.y + j * CELL, a);
      return true;
    });

    x.fillStyle = ROCK_RGB;
    rocks = rocks.filter((b) => {
      b.vy += G * dt; b.x += b.vx * dt; b.y += b.vy * dt; b.vx *= 1 - 0.6 * dt;
      if (!inGutter(b.x) && b.vy > 0) b.x += (b.x - (colL + colR) / 2 < 0 ? -1 : 1) * 260 * dt; // drift out of the text column
      const c = Math.round(b.x / CELL);
      if (b.vy > 0 && inGutter(b.x) && b.y + CELL >= ground(c)) {
        if (!b.bounced && b.vy > 200) { b.bounced = true; b.vy = -b.vy * 0.22; b.vx *= 0.5; b.y = ground(c) - CELL; return true; } // knock
        b.cells.forEach(([i]) => settle(c + i, b.alpha));
        return false;
      }
      if (b.y - top > H + 400 && b.y > groundY + 50) return false;
      const q = Math.floor(Math.max(0, t - b.born) / 1000 / b.turn) % 4;
      for (const [i, j] of b.cells) { // rotate by q quarter turns
        const ri = q === 0 ? i : q === 1 ? -j : q === 2 ? -i : j, rj = q === 0 ? j : q === 1 ? i : q === 2 ? -j : -i;
        dot(b.x + ri * CELL, b.y + rj * CELL, b.alpha);
      }
      return true;
    });

    dust = dust.filter((d) => {
      d.age += dt; if (d.age > d.life) return false;
      d.vy += 380 * dt; d.x += d.vx * dt; d.y += d.vy * dt;
      dot(d.x, d.y, 0.45 * (1 - d.age / d.life));
      return true;
    });

    const pileOn = pile.size && groundY - top < H + PILE_MAX * CELL;
    if (pileOn) {
      for (const [c, stack] of pile) stack.forEach((a, k) => {
        x.globalAlpha = a;
        x.fillRect(c, Math.round((groundY - (k + 1) * CELL - top) / CELL), 1, 1);
      });
    }
    x.globalAlpha = 1;
    drawn = !!(cracks.length || rocks.length || dust.length || pileOn);
    // keep animating while anything moves; otherwise only redraw when scroll/resize moves the pile
    if (rocks.length || dust.length || cracks.length) requestAnimationFrame(frame); else running = false;
  }
  // one still frame per animation frame at most, however many scroll/resize events arrive
  function redraw() {
    if (running || queued || (!pile.size && !drawn)) return;
    queued = true;
    requestAnimationFrame((t) => { queued = false; if (!running) { last = t; frame(t); } });
  }

  size();
  if (Math.min(colL, W - colR) < 60) { cv.remove(); return; } // no margins on phones
  let resizing = 0;
  addEventListener("resize", () => { cancelAnimationFrame(resizing); resizing = requestAnimationFrame(() => { size(); redraw(); }); });
  new ResizeObserver(() => { measure(); redraw(); }).observe(document.body); // content above the ground grew or shrank
  addEventListener("scroll", redraw, { passive: true });
  addEventListener("click", (e) => { if (minable(e) && !getSelection().toString()) strike(e.pageX, e.pageY); });
})();
