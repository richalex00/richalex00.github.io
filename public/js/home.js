// Home page: Stockholm clock, pixel avatar and marble statue. (The contour map is topo.js.)
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
// The whole photo on a 32x32 grid: fine enough that the face reads at 76px,
// coarse enough to stay pixel art. Hover shows the full photo.
const av = new Image();
av.onload = () => {
  const c = document.getElementById("avatar"), x = c.getContext("2d");
  const s = Math.min(av.width, av.height);
  x.imageSmoothingEnabled = true;
  x.drawImage(av, (av.width - s) / 2, (av.height - s) / 2, s, s, 0, 0, c.width, c.height);
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


})();
