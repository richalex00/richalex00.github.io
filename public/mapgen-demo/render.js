// Draws a generated map with the project's tiles. Shared by the demo (app.js)
// and by the script that renders the homepage tile animation.

export const T = 16; // tile size in the source tileset, in pixels

export async function loadAssets(base = "") {
  const [atlas, tiles] = await Promise.all([
    new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = base + "atlas.png"; }),
    fetch(base + "tiles.json").then((r) => r.json()),
  ]);
  // One small canvas per water animation frame, used as a repeating pattern
  const water = tiles.water.frames.map((key) => {
    const f = tiles.frames[key], c = document.createElement("canvas");
    c.width = f.w; c.height = f.h;
    c.getContext("2d").drawImage(atlas, f.x, f.y, f.w, f.h, 0, 0, f.w, f.h);
    return c;
  });
  return { atlas, tiles, water };
}

// Screen layout follows the Unity scene: map x is printed at world -x, so the
// map is mirrored left-right on screen; y runs top to bottom.
function landSprite(tiles, map, x, y) {
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

// Land, rocks, objects and an optional island highlight, on a transparent
// context sized map.length * T square. `objects` defaults to result.objects.
export function drawLayers(c, assets, result, { selected = 0, objects = result.objects } = {}) {
  const { atlas, tiles } = assets;
  const { map, islandInfo } = result;
  const W = map.length, H = map[0].length;
  const col = (x) => W - 1 - x;
  const blit = (key, px, py) => {
    const f = tiles.frames[key];
    c.drawImage(atlas, f.x, f.y, f.w, f.h, px, py, f.w, f.h);
  };
  c.clearRect(0, 0, W * T, H * T);

  for (let x = 0; x < W; x++)
    for (let y = 0; y < H; y++)
      if (map[x][y] >= 1) blit(landSprite(tiles, map, x, y), col(x) * T, y * T);
  for (let x = 0; x < W; x++)
    for (let y = 0; y < H; y++)
      if (map[x][y] >= 2) blit(tiles.rock, col(x) * T, y * T);

  // Objects sit at tile corners in the original (sprite pivot centred on the
  // integer world position), so they are offset half a tile from the grid.
  for (const o of objects) blit(tiles.objects[o.name].sprite, (col(o.x) - 0.5) * T, (o.y + 0.5) * T);

  if (selected && islandInfo) {
    c.fillStyle = "rgba(164, 67, 118, 0.45)";
    for (let x = 0; x < W; x++)
      for (let y = 0; y < H; y++)
        if (islandInfo[x][y] === selected) c.fillRect(col(x) * T, y * T, T, T);
  }
}

// Fill a context with the water animation frame `frame`.
export function drawWater(c, assets, frame, w, h) {
  c.fillStyle = c.createPattern(assets.water[frame % assets.water.length], "repeat");
  c.fillRect(0, 0, w, h);
}
