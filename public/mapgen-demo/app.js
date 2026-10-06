import { generate, DEFAULTS, STAGES } from "./gen.js";

const T = 16; // tile size in the source tileset, in pixels

// Controls mirror the Unity inspector (MapGenerator + ObjectGenerator), with
// the same ranges. `get`/`set` map each slider onto the params object.
const CONTROLS = [
  { legend: "Map", rows: [
    { id: "mapSize", label: "Map size", min: 32, max: 96, step: 16, get: (p) => p.mapSize, set: (p, v) => (p.mapSize = v), hint: "Tiles per side of each map." },
    { id: "gridSize", label: "Grid", min: 1, max: 3, get: (p) => p.gridSize, set: (p, v) => (p.gridSize = v), hint: "A grid of maps, each with its own variation roll." },
  ] },
  { legend: "Land", rows: [
    { id: "landSat", label: "Saturation", min: 0, max: 100, get: (p) => p.land.saturation, set: (p, v) => (p.land.saturation = v), hint: "Chance each tile starts as land." },
    { id: "landVar", label: "Variation", min: 0, max: 10, get: (p) => p.land.variation, set: (p, v) => (p.land.variation = v), hint: "± random shift in saturation per map." },
    { id: "landCell", label: "Cellular", min: 0, max: 10, get: (p) => p.land.cellular, set: (p, v) => (p.land.cellular = v), hint: "Smoothing passes of the cellular automaton." },
  ] },
  { legend: "Rocks", rows: [
    { id: "rockSat", label: "Saturation", min: 0, max: 100, get: (p) => p.rocks.saturation, set: (p, v) => (p.rocks.saturation = v) },
    { id: "rockDist", label: "Distance", min: 0, max: 5, get: (p) => p.rocks.distance, set: (p, v) => (p.rocks.distance = v), hint: "How far inland rock may start." },
    { id: "rockCell", label: "Cellular", min: 0, max: 10, get: (p) => p.rocks.cellular, set: (p, v) => (p.rocks.cellular = v) },
  ] },
  { legend: "Islands", rows: [
    { id: "minLand", label: "Min land", min: 0, max: 200, step: 5, get: (p) => p.minimumLandTiles, set: (p, v) => (p.minimumLandTiles = v), hint: "Flood fill sinks islands smaller than this." },
    { id: "minWater", label: "Min water", min: 0, max: 200, step: 5, get: (p) => p.minimumWaterTiles, set: (p, v) => (p.minimumWaterTiles = v), hint: "…and fills in lakes smaller than this." },
  ] },
  { legend: "Objects", rows: [
    { id: "trees", label: "Trees", min: 0, max: 100, get: (p) => p.objects[0].saturation, set: (p, v) => (p.objects[0].saturation = v) },
    { id: "plants", label: "Bushes", min: 0, max: 100, get: (p) => p.objects[1].saturation, set: (p, v) => (p.objects[1].saturation = v) },
    { id: "waterRocks", label: "Sea rocks", min: 0, max: 100, get: (p) => p.objects[2].saturation, set: (p, v) => (p.objects[2].saturation = v) },
  ] },
];

const CAPTIONS = {
  noise: "1 · Every tile is randomly land or water, weighted by land saturation.",
  cellular: "2 · Cellular automaton: a tile becomes land if more than 4 of its 8 neighbours are land, and stays land with at least 4. Repeated, noise turns into coastlines.",
  rocks: "3 · A second layer grows only on land far enough from water, then gets its own smoothing passes.",
  islands: "4 · Flood fill finds every connected island and lake, sinks the small islands and fills the small lakes. Click land to see its island.",
  objects: "5 · Objects are scattered on their layer where every corner nearby is the same layer, so trees stay off the shoreline.",
};

const clone = (o) => JSON.parse(JSON.stringify(o));
const $ = (id) => document.getElementById(id);
const canvas = $("map"), ctx = canvas.getContext("2d");
const staticLayer = document.createElement("canvas"), sctx = staticLayer.getContext("2d");

let params = clone(DEFAULTS);
let seed = randomSeed();
let stage = "objects";
let result = null;
let selected = 0; // selected island number, 0 = none
let atlas, tiles, waterPatterns = [];

function randomSeed() { return (Math.random() * 2 ** 31) >>> 0; }

// ---------- Controls ----------
function buildControls() {
  const form = $("controls");
  form.innerHTML = "";
  for (const group of CONTROLS) {
    const fs = document.createElement("fieldset");
    fs.innerHTML = `<legend>${group.legend}</legend>`;
    for (const c of group.rows) {
      const row = document.createElement("div");
      row.className = "row";
      row.innerHTML =
        `<label for="${c.id}">${c.label}</label>` +
        `<input type="range" id="${c.id}" min="${c.min}" max="${c.max}" step="${c.step ?? 1}" value="${c.get(params)}">` +
        `<output for="${c.id}">${c.get(params)}</output>` +
        (c.hint ? `<span class="hint">${c.hint}</span>` : "");
      const input = row.querySelector("input"), out = row.querySelector("output");
      input.addEventListener("input", () => {
        c.set(params, Number(input.value));
        out.textContent = input.value;
        run();
      });
      fs.appendChild(row);
    }
    form.appendChild(fs);
  }
}

// ---------- Rendering ----------
// Screen layout follows the Unity scene: map x is printed at world -x, so the
// map is mirrored left-right on screen; y runs top to bottom.
function landSprite(map, x, y) {
  const W = map.length, H = map[0].length;
  const isLand = (mx, my) => mx >= 0 && mx < W && my >= 0 && my < H && map[mx][my] >= 1;
  // RuleTile: first rule whose neighbours all match wins. Rule offsets are in
  // Unity world space (y up); world dx is map -dx, world dy is map -dy.
  for (const rule of tiles.land.rules) {
    let ok = true;
    for (const [dx, dy, n] of rule.neighbors) {
      const land = isLand(x - dx, y - dy);
      if ((n === 1 && !land) || (n === 2 && land)) { ok = false; break; }
    }
    if (ok) return rule.sprites[0];
  }
  return tiles.land.default;
}

function blit(c, key, px, py) {
  const f = tiles.frames[key];
  c.drawImage(atlas, f.x, f.y, f.w, f.h, px, py, f.w, f.h);
}

function drawStatic() {
  const { map, objects, islandInfo } = result;
  const W = map.length, H = map[0].length;
  staticLayer.width = canvas.width = W * T;
  staticLayer.height = canvas.height = H * T;
  sctx.clearRect(0, 0, staticLayer.width, staticLayer.height);
  const col = (x) => W - 1 - x;

  for (let x = 0; x < W; x++)
    for (let y = 0; y < H; y++)
      if (map[x][y] >= 1) blit(sctx, landSprite(map, x, y), col(x) * T, y * T);
  for (let x = 0; x < W; x++)
    for (let y = 0; y < H; y++)
      if (map[x][y] >= 2) blit(sctx, tiles.rock, col(x) * T, y * T);

  // Objects sit at tile corners in the original (sprite pivot centred on the
  // integer world position), so they are offset half a tile from the grid.
  const sprite = Object.fromEntries(Object.entries(tiles.objects).map(([k, v]) => [k, v.sprite]));
  for (const o of objects) blit(sctx, sprite[o.name], (col(o.x) - 0.5) * T, (o.y + 0.5) * T);

  if (selected && islandInfo) {
    sctx.fillStyle = "rgba(164, 67, 118, 0.45)";
    for (let x = 0; x < W; x++)
      for (let y = 0; y < H; y++)
        if (islandInfo[x][y] === selected) sctx.fillRect(col(x) * T, y * T, T, T);
  }
  fitCanvas();
}

let frame = 0;
function drawFrame() {
  ctx.fillStyle = waterPatterns[frame];
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(staticLayer, 0, 0);
}

function fitCanvas() {
  const view = $("view");
  const size = Math.min(view.clientWidth - 8, view.clientHeight - 8);
  canvas.style.width = canvas.style.height = Math.max(64, size) + "px";
}

// ---------- Generate ----------
function run() {
  const t0 = performance.now();
  result = generate(params, seed, stage);
  const ms = performance.now() - t0;
  if (selected && (!result.islandInfo || selected > result.islands.length)) selected = 0;
  drawStatic();
  drawFrame();
  $("seed").textContent = seed;
  const total = result.map.length ** 2;
  let land = 0;
  for (const c of result.map) for (const v of c) if (v >= 1) land++;
  const parts = [`${result.map.length}×${result.map.length} tiles`, `${Math.round((land / total) * 100)}% land`];
  if (result.islandInfo) parts.push(`${result.islands.length} islands`, `${result.removed.land} sunk`, `${result.removed.water} lakes filled`);
  if (stage === "objects") parts.push(`${result.objects.length} objects`);
  parts.push(`${ms.toFixed(1)} ms`);
  $("status").textContent = parts.join(" · ");
  $("caption").textContent = CAPTIONS[stage];
  document.querySelectorAll("#steps button").forEach((b) => {
    const i = STAGES.indexOf(b.dataset.stage), cur = STAGES.indexOf(stage);
    b.setAttribute("aria-pressed", String(i === cur));
    b.classList.toggle("done", i < cur);
  });
}

function newMap() { seed = randomSeed(); selected = 0; run(); }

// ---------- Interaction ----------
function tileAt(ev) {
  const r = canvas.getBoundingClientRect();
  const W = result.map.length;
  const cx = Math.floor(((ev.clientX - r.left) / r.width) * W);
  const y = Math.floor(((ev.clientY - r.top) / r.height) * W);
  const x = W - 1 - cx;
  return x >= 0 && x < W && y >= 0 && y < W ? { x, y } : null;
}

canvas.addEventListener("click", (ev) => {
  const t = tileAt(ev);
  if (!t) return;
  if (!result.islandInfo) { stage = "islands"; run(); }
  const n = result.islandInfo[t.x][t.y];
  selected = n === selected ? 0 : n;
  drawStatic(); drawFrame();
  showTip(ev, n ? `Island ${n} · ${result.islands[n - 1].length} tiles` : result.map[t.x][t.y] >= 2 ? "Rock" : "Water");
});
canvas.addEventListener("mousemove", (ev) => {
  if (!result.islandInfo) return hideTip();
  const t = tileAt(ev);
  const n = t && result.islandInfo[t.x][t.y];
  n ? showTip(ev, `Island ${n} · ${result.islands[n - 1].length} tiles`) : hideTip();
});
canvas.addEventListener("mouseleave", hideTip);
function showTip(ev, text) {
  const tip = $("tip"), r = $("view").getBoundingClientRect();
  tip.textContent = text; tip.hidden = false;
  tip.style.left = ev.clientX - r.left + "px"; tip.style.top = ev.clientY - r.top + "px";
}
function hideTip() { $("tip").hidden = true; }

document.querySelectorAll("#steps button").forEach((b) =>
  b.addEventListener("click", () => { stopPlay(); stage = b.dataset.stage; run(); }));

let playTimer = null;
function stopPlay() { clearInterval(playTimer); playTimer = null; $("play").textContent = "▶ Play"; }
$("play").addEventListener("click", () => {
  if (playTimer) return stopPlay();
  let i = 0;
  stage = STAGES[0]; run();
  $("play").textContent = "■ Stop";
  playTimer = setInterval(() => {
    if (++i >= STAGES.length) return stopPlay();
    stage = STAGES[i]; run();
  }, 1100);
});

$("new").addEventListener("click", newMap);
$("reset").addEventListener("click", () => { params = clone(DEFAULTS); buildControls(); run(); });
$("save").addEventListener("click", () => {
  const a = document.createElement("a");
  a.download = `map-${seed}.png`;
  a.href = canvas.toDataURL("image/png");
  a.click();
});
window.addEventListener("keydown", (ev) => {
  if (ev.code === "Space" && !(ev.target instanceof HTMLInputElement && ev.target.type !== "range")) {
    ev.preventDefault();
    newMap();
  }
});
new ResizeObserver(fitCanvas).observe($("view"));

// ---------- Boot ----------
async function boot() {
  const [img, data] = await Promise.all([
    new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = "atlas.png"; }),
    fetch("tiles.json").then((r) => r.json()),
  ]);
  atlas = img; tiles = data;
  // One pattern per water animation frame; the whole sea is filled at once.
  waterPatterns = tiles.water.frames.map((key) => {
    const f = tiles.frames[key], c = document.createElement("canvas");
    c.width = f.w; c.height = f.h;
    c.getContext("2d").drawImage(atlas, f.x, f.y, f.w, f.h, 0, 0, f.w, f.h);
    return ctx.createPattern(c, "repeat");
  });
  buildControls();
  run();
  // AnimatedTile speed 1.5 in the original: 1.5 frames per second
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setInterval(() => { frame = (frame + 1) % waterPatterns.length; drawFrame(); }, 1000 / tiles.water.speed);
  }
}
boot();
