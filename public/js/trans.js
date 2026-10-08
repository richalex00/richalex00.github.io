/* Pixel contour page transition.
   Click a [data-trans] link: the contour map spreads out in pixels from the click,
   ripples once, then the next page dissolves it away from the centre. */
(function () {
  const KEY = "px-trans";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const CELL = 7, STEP = 0.17;
  const PINE = [31, 77, 63], LINE = [79, 125, 115], INDEX = [156, 207, 192];

  const store = {
    get() { try { return JSON.parse(sessionStorage.getItem(KEY)); } catch (e) { return null; } },
    set(v) { try { sessionStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} },
    clear() { try { sessionStorage.removeItem(KEY); } catch (e) {} },
  };

  function makeHills() {
    return Array.from({ length: 8 }, () => ({ x: Math.random(), y: Math.random(), r: 0.08 + Math.random() * 0.16, a: Math.random() < 0.3 ? -1 : 1 }));
  }

  function overlay(hills) {
    const c = document.createElement("canvas");
    const W = Math.ceil(innerWidth / CELL), H = Math.ceil(innerHeight / CELL);
    c.width = W; c.height = H;
    Object.assign(c.style, { position: "fixed", inset: "0", width: "100vw", height: "100vh", zIndex: 1000, imageRendering: "pixelated", pointerEvents: "none" });
    document.documentElement.appendChild(c);
    const ctx = c.getContext("2d"), img = ctx.createImageData(W, H);
    const field = new Float32Array(W * H), jitter = new Float32Array(W * H), band = new Int32Array(W * H);
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
      const x = i / W, y = (j / H) * (H / W);
      let s = 0;
      for (const k of hills) s += k.a * Math.exp(-((x - k.x) ** 2 + (y - k.y * H / W) ** 2) / (2 * k.r * k.r));
      field[j * W + i] = s;
      jitter[j * W + i] = Math.random();
    }
    let dist = null, distKey = "";
    function draw(p, ox, oy, phase, covering) {
      const key = ox + "," + oy;
      if (key !== distKey) {
        const cx = ox / CELL, cy = oy / CELL;
        const maxD = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy));
        dist = new Float32Array(W * H);
        for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) dist[j * W + i] = Math.hypot(i - cx, j - cy) / maxD * 0.94 + jitter[j * W + i] * 0.06;
        distKey = key;
      }
      const d8 = img.data;
      for (let k = 0; k < W * H; k++) band[k] = Math.floor((field[k] + phase) / STEP); // once per pixel, not 3x
      for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
        const k = j * W + i, o = k * 4;
        const d = dist[k];
        const on = covering ? d <= p : d > p;
        if (!on) { d8[o + 3] = 0; continue; }
        const b = band[k];
        const edge = i < W - 1 && j < H - 1 && (b !== band[k + 1] || b !== band[k + W]);
        const col = edge ? (((b % 5) + 5) % 5 === 0 ? INDEX : LINE) : PINE;
        d8[o] = col[0]; d8[o + 1] = col[1]; d8[o + 2] = col[2]; d8[o + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
    }
    return { c, draw };
  }

  function animate(ms, fn) {
    return new Promise(res => {
      const t0 = performance.now();
      (function f(t) { const p = Math.min(1, (t - t0) / ms); fn(p); p < 1 ? requestAnimationFrame(f) : res(); })(t0);
    });
  }
  const ease = p => 1 - Math.pow(1 - p, 3);

  // ---- leaving: cover from the click point, then ripple ----
  document.addEventListener("click", async e => {
    const a = e.target.closest("a[data-trans]");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    const hills = makeHills();
    store.set({ hills });
    if (reduce) { location.href = a.href; return; }
    const { draw } = overlay(hills);
    const ox = e.clientX || innerWidth / 2, oy = e.clientY || innerHeight / 2;
    // spread and ripple in one smooth move
    await animate(340, p => draw(ease(p) * 1.02, ox, oy, p * STEP, true));
    location.href = a.href;
  });

  // ---- arriving: dissolve from the centre ----
  const state = store.get();
  if (state) {
    store.clear();
    if (!reduce) {
      const { c, draw } = overlay(state.hills);
      const ox = innerWidth / 2, oy = innerHeight / 2;
      draw(-1, ox, oy, STEP, false);
      animate(380, p => draw(ease(p) * 1.02, ox, oy, STEP + p * STEP, false)).then(() => c.remove());
    }
  }
  document.documentElement.classList.remove("trans-in");

  // back/forward cache: never restore a page still covered
  addEventListener("pageshow", ev => { if (ev.persisted) document.querySelectorAll("html > canvas").forEach(c => c.remove()); });
})();
