// Home page: Stockholm clock, pixel avatar, marble statue and the pixel contour map behind the name.
(function () {
/* ---------- Clock ---------- */
function tick() {
  const now = new Date();
  const t = now.toLocaleTimeString("en-GB", { timeZone: "Europe/Stockholm", hour: "2-digit", minute: "2-digit" });
  const d = now.toLocaleDateString("en-GB", { timeZone: "Europe/Stockholm", weekday: "short" });
  document.getElementById("clock").textContent = `Stockholm ${d} ${t}`;
  document.getElementById("codetime").textContent = `'${t}'`;
}
tick(); setInterval(tick, 10000);

/* ---------- Pixel avatar: the real photo, downsampled ---------- */
// Cropped to head and shoulders (the photo is mostly cliffs and sea), so the
// face spans enough of the 24x24 grid to be recognisable. Hover shows the full photo.
const AVATAR_CROP = { x: 0.3, y: 0.275, size: 0.575 }; // fractions of the photo
const av = new Image();
av.onload = () => {
  const c = document.getElementById("avatar"), x = c.getContext("2d");
  const s = Math.min(av.width, av.height);
  x.imageSmoothingEnabled = true;
  x.drawImage(av, AVATAR_CROP.x * s, AVATAR_CROP.y * s, AVATAR_CROP.size * s, AVATAR_CROP.size * s, 0, 0, c.width, c.height);
};
av.src = "/img/me.jpg";

/* ---------- dithered marble statue, carved in pixel by pixel ---------- */
(function statue() {
  const pieces = [
    { src: "/statues/athlete.png", name: "Head of an athlete" },
    { src: "/statues/torso.png", name: "Torso of Herakles" },
    { src: "/statues/herakles.png", name: "Head of Herakles" },
    { src: "/statues/diadoumenos.png", name: "The Diadoumenos" },
  ];
  const c = document.getElementById("statue"), x = c.getContext("2d", { willReadFrequently: true }), cap = document.getElementById("statue-cap");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let n = 0, seen = false, cache = {};
  function load(src) {
    return cache[src] || (cache[src] = new Promise(res => { const im = new Image(); im.onload = () => res(im); im.src = src; }));
  }
  async function carve(i) {
    const im = await load(pieces[i].src);
    c.width = im.width; c.height = im.height;
    c.setAttribute("aria-label", "Pixel-art marble statue: " + pieces[i].name);
    x.drawImage(im, 0, 0);
    if (reduce) return;
    const full = x.getImageData(0, 0, c.width, c.height), out = x.createImageData(c.width, c.height);
    const N = c.width * c.height, rank = new Float32Array(N);
    for (let k = 0; k < N; k++) rank[k] = Math.random() * 0.7 + (k / c.width / c.height) * 0.3; // roughly top-down, chiselled
    const t0 = performance.now(), ms = 650;
    (function f(t) {
      const p = Math.min(1, (t - t0) / ms);
      for (let k = 0; k < N; k++) if (rank[k] <= p) for (let q = 0; q < 4; q++) out.data[k * 4 + q] = full.data[k * 4 + q];
      x.putImageData(out, 0, 0);
      if (p < 1) requestAnimationFrame(f);
    })(t0);
  }
  load(pieces[0].src).then(im => { if (!seen) { c.width = im.width; c.height = im.height; } }); // reserve space before carving
  new IntersectionObserver((es, o) => { if (es[0].isIntersecting && !seen) { seen = true; carve(0); o.disconnect(); } }, { threshold: 0.6 }).observe(c);
  c.parentElement.addEventListener("click", () => { n = (n + 1) % pieces.length; cap.textContent = pieces[n].name; carve(n); });
})();


/* ---------- Pixel topo map: contour lines at low resolution, scaled up ---------- */
// wait for the pixel font so the gap around the name is measured correctly
document.fonts.ready.then(function topo() {
  const cv = document.getElementById("topo"), hero = cv.parentElement, h1 = hero.querySelector("h1");
  const CELL = 5;
  const W = Math.ceil(hero.clientWidth / CELL), H = Math.ceil(hero.clientHeight / CELL);
  cv.width = W; cv.height = H;
  const x = cv.getContext("2d");
  const hills = Array.from({ length: 7 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: 18 + Math.random() * 40, a: Math.random() < 0.3 ? -1 : 1 }));
  const f = (i, j) => hills.reduce((s, k) => s + k.a * Math.exp(-((i - k.x) ** 2 + (j - k.y) ** 2) / (2 * k.r * k.r)), 0);
  const field = []; for (let j = 0; j < H; j++) { field[j] = []; for (let i = 0; i < W; i++) field[j][i] = f(i, j); }
  const STEP = 0.17, band = v => Math.floor(v / STEP);
  // keep the name clear, like a label on a real map
  const hr = hero.getBoundingClientRect(), tr = h1.getBoundingClientRect(), pad = 14;
  const cx0 = (tr.left - hr.left - pad) / CELL, cx1 = (tr.right - hr.left + pad) / CELL;
  const cy0 = (tr.top - hr.top - pad) / CELL, cy1 = (tr.bottom - hr.top + pad) / CELL;
  for (let j = 0; j < H - 1; j++) for (let i = 0; i < W - 1; i++) {
    const b = band(field[j][i]);
    if (b === band(field[j][i + 1]) && b === band(field[j + 1][i])) continue;
    if (i > cx0 && i < cx1 && j > cy0 && j < cy1) continue;
    const index = ((b % 5) + 5) % 5 === 0;
    x.fillStyle = index ? "rgba(79,125,115,0.42)" : "rgba(79,125,115,0.18)";
    x.fillRect(i, j, 1, 1);
  }
});
})();
