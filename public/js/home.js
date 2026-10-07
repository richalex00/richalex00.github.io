// Home page: Stockholm clock, pixel avatar and Sisyphus. (The contour map is topo.js.)
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
const avBtn = document.querySelector(".avatar");
avBtn.addEventListener("click", () => {
  const on = avBtn.getAttribute("aria-pressed") !== "true";
  avBtn.setAttribute("aria-pressed", on);
  avBtn.classList.toggle("hold", !on);
});
avBtn.addEventListener("mouseleave", () => avBtn.classList.remove("hold"));

/* ---------- Sisyphus: dithered marble, carved in pixel by pixel ----------
   Each push moves the percentage on his screen. At 100% it ships as the next
   version and starts again from 0%. (The rotating statues are tag statues-rotation.) */
(function sisyphus() {
  const c = document.getElementById("statue"), x = c.getContext("2d", { willReadFrequently: true }), btn = c.parentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const steps = [0, 19, 36, 51, 64, 75, 84, 91, 96, 99, 100]; // the last few percent take the longest
  const screen = { x: 45, y: 26 }; // centre of the CRT screen, in sprite pixels
  const font = { // 3x5 pixel digits
    0: "111101101101111", 1: "010110010010111", 2: "111001111100111", 3: "111001111001111", 4: "101101111001001",
    5: "111100111001111", 6: "111100111101111", 7: "111001001001001", 8: "111101111101111", 9: "111101111001111",
    "%": "101001010100101", v: "000101101101010",
  };
  let step = 0, version = 1, base = null, seen = false, timer = 0;

  function show(text) {
    x.putImageData(base, 0, 0);
    if (!text) return;
    const w = text.length * 4 - 1, x0 = Math.round(screen.x - w / 2), y0 = screen.y - 2;
    x.fillStyle = "#A44376";
    [...text].forEach((ch, k) => [...font[ch]].forEach((on, i) => {
      if (on === "1") x.fillRect(x0 + k * 4 + (i % 3), y0 + Math.floor(i / 3), 1, 1);
    }));
  }
  function label(text) {
    btn.setAttribute("aria-label", "Sisyphus carrying a computer uphill" + (text ? `, screen reads ${text}` : "") + ". Push him.");
  }
  function current() { return step ? steps[step] + "%" : ""; }

  const im = new Image();
  im.onload = () => {
    c.width = im.width; c.height = im.height; // reserve space before carving
    x.drawImage(im, 0, 0); base = x.getImageData(0, 0, c.width, c.height);
    if (!reduce) x.clearRect(0, 0, c.width, c.height);
    new IntersectionObserver((es, o) => { if (es[0].isIntersecting && !seen) { seen = true; carve(); o.disconnect(); } }, { threshold: 0.6 }).observe(c);
  };
  im.src = "/statues/sisyphus.png";
  label("");

  function carve() {
    if (reduce) return show(current());
    const out = x.createImageData(c.width, c.height), N = c.width * c.height, rank = new Float32Array(N);
    for (let k = 0; k < N; k++) rank[k] = Math.random() * 0.7 + (k / N) * 0.3; // roughly top-down, chiselled
    const t0 = performance.now(), ms = 650;
    (function f(t) {
      const p = Math.min(1, (t - t0) / ms);
      for (let k = 0; k < N; k++) if (rank[k] <= p) for (let q = 0; q < 4; q++) out.data[k * 4 + q] = base.data[k * 4 + q];
      x.putImageData(out, 0, 0);
      if (p < 1) requestAnimationFrame(f); else show(current());
    })(t0);
  }

  btn.addEventListener("click", () => {
    if (!base) return;
    clearTimeout(timer);
    if (step === steps.length - 1) { // shipped: show the new version, then back to the bottom
      version++; step = 0;
      show("v" + version); label("v" + version);
      timer = setTimeout(() => { show("0%"); label("0%"); }, 1100);
      return;
    }
    step++; show(current()); label(current());
  });
})();


})();
