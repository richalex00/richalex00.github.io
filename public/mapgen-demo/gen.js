// Port of MapGenerator.cs / ObjectGenerator.cs (BSc thesis, Unity 2020.3) to
// plain JavaScript. Same algorithm and parameters, step for step: random fill,
// cellular automata for the land layer, a constrained extra layer (rocks), flood
// fill to remove small islands and lakes, then object placement. Kept close to
// the C# so the two can be read side by side; names follow the original.

// Seeded RNG (mulberry32), so a map can be regenerated exactly while sliders move.
export function rng(seed) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    // UnityEngine.Random.Range(int min, int max): max exclusive
    int: (min, max) => min + Math.floor(next() * (max - min)),
    // UnityEngine.Random.Range(float min, float max): max inclusive
    float: (min, max) => min + next() * (max - min),
  };
}

export const DEFAULTS = {
  gridSize: 1,
  mapSize: 64,
  // layers[0] is water (always full); layers[1] land; layers[2] rocks
  land: { saturation: 50, variation: 5, cellular: 10 },
  rocks: { saturation: 55, distance: 1, cellular: 2 },
  minimumLandTiles: 25,
  minimumWaterTiles: 20,
  objects: [
    { name: "Tree", layer: 1, saturation: 33, distance: 1 },
    { name: "Plant", layer: 1, saturation: 5, distance: 1 },
    { name: "WaterRock", layer: 0, saturation: 3, distance: 1 },
  ],
};

export const STAGES = ["noise", "cellular", "rocks", "islands", "objects"];

const BIRTH = 4, DEATH = 4, BIRTH_X = 4, DEATH_X = 4;
const grid = (w, h) => Array.from({ length: w }, () => new Int8Array(h));

// GenerateTerrainMap(): one map chunk, stopping early at `stage` for the demo's
// step-through view. RNG calls happen in the same order whatever the stage.
function terrainMap(p, R, stage) {
  const width = p.mapSize, height = p.mapSize;
  const initChance = p.land.saturation + Math.trunc(R.float(-p.land.variation, p.land.variation));
  let map = grid(width, height);

  // Initialize(): random fill
  for (let x = 0; x < width; x++)
    for (let y = 0; y < height; y++)
      map[x][y] = R.int(1, 101) < initChance ? 1 : 0;
  if (stage === "noise") return map;

  // GenerateTilePositions(): cellular automaton, repeated `cellular` times
  for (let i = 0; i < p.land.cellular; i++) {
    const next = grid(width, height);
    for (let x = 0; x < width; x++)
      for (let y = 0; y < height; y++) {
        let n = 0;
        for (let dx = -1; dx <= 1; dx++)
          for (let dy = -1; dy <= 1; dy++) {
            if (!dx && !dy) continue;
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) n += map[nx][ny];
          }
        next[x][y] = (map[x][y] === 1 && n >= DEATH) || (map[x][y] === 0 && n > BIRTH) ? 1 : 0;
      }
    map = next;
  }
  if (stage === "cellular") return map;

  // InitializeExtra() + GenerateLayer(): the rock layer, grown only where the
  // land underneath is at least `distance` tiles from any water (corner check)
  // (The C# also computes a variation-adjusted chance here but never uses it,
  // so the rock layer has no variation control.)
  const level = 1, d = p.rocks.distance;
  for (let x = d + 1; x < width - d - 1; x++)
    for (let y = d + 1; y < height - d - 1; y++)
      if (map[x][y] === level && map[x - d][y - d] >= level && map[x - d][y + d] >= level &&
          map[x + d][y - d] >= level && map[x + d][y + d] >= level)
        map[x][y] = R.int(1, 101) < p.rocks.saturation ? level + 1 : level;

  for (let i = 0; i < p.rocks.cellular; i++) {
    const next = grid(width, height);
    for (let x = 0; x < width; x++)
      for (let y = 0; y < height; y++) {
        const v = map[x][y];
        if (v < level) { next[x][y] = v; continue; }
        let n = 0;
        for (let dx = -1; dx <= 1; dx++)
          for (let dy = -1; dy <= 1; dy++) {
            if (!dx && !dy) continue;
            const nx = x + dx, ny = y + dy;
            if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
            if (v === map[nx][ny]) n++;
            if (v === level && map[nx][ny] < level) n++;
          }
        next[x][y] = (v === level + 1 && n > BIRTH_X) || (v === level && n < DEATH_X) ? level + 1 : level;
      }
    map = next;
  }
  return map;
}

// MakeIslands() / GetIslands(): 4-connected flood fill over tiles of one type
function getIslands(map, tileType) {
  const W = map.length, H = map[0].length, seen = grid(W, H), islands = [];
  for (let x = 0; x < W; x++)
    for (let y = 0; y < H; y++) {
      if (seen[x][y] || map[x][y] !== tileType) continue;
      const island = [], queue = [[x, y]];
      seen[x][y] = 1;
      while (queue.length) {
        const [cx, cy] = queue.shift();
        island.push([cx, cy]);
        for (const [nx, ny] of [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]])
          if (nx >= 0 && nx < W && ny >= 0 && ny < H && !seen[nx][ny] && map[nx][ny] === tileType) {
            seen[nx][ny] = 1;
            queue.push([nx, ny]);
          }
      }
      islands.push(island);
    }
  return islands;
}

// GenerateNewMap(): returns { map, islandInfo, islands, objects, removed }
export function generate(params, seed, stage = "objects") {
  const p = params, R = rng(seed), S = p.mapSize, G = p.gridSize;
  const W = S * G, H = S * G;
  const map = grid(W, H);

  // MakeGridMap(): each chunk of the grid is its own map, with its own
  // variation roll, so a 2x2 grid shows four distinct regions.
  for (let i = 0; i < G; i++)
    for (let j = 0; j < G; j++) {
      const chunk = terrainMap(p, R, stage);
      for (let x = 0; x < S; x++) for (let y = 0; y < S; y++) map[i * S + x][j * S + y] = chunk[x][y];
    }

  const result = { map, islandInfo: null, islands: [], objects: [], removed: { land: 0, water: 0 } };
  const before = STAGES.indexOf(stage) < STAGES.indexOf("islands");
  if (before) return result;

  // IslandGenerator(): fill small lakes, sink small islands, number the rest
  for (const lake of getIslands(map, 0))
    if (lake.length < p.minimumWaterTiles) {
      for (const [x, y] of lake) map[x][y] = 1;
      result.removed.water++;
    }
  const islandInfo = grid(W, H);
  for (const island of getIslands(map, 1)) {
    if (island.length < p.minimumLandTiles) {
      for (const [x, y] of island) map[x][y] = 0;
      result.removed.land++;
    } else {
      result.islands.push(island);
      for (const [x, y] of island) islandInfo[x][y] = result.islands.length;
    }
  }
  result.islandInfo = islandInfo;
  if (stage === "islands") return result;

  // ObjGenerator(): per tile, each object type may spawn if the tile is its
  // layer and all four corners `distance` away are at least that layer.
  // (exclusive is false in the scene, so objects can share a tile.)
  for (let x = 0; x < W; x++)
    for (let y = 0; y < H; y++)
      for (const o of p.objects) {
        const d = o.distance;
        if (map[x][y] !== o.layer || x <= d + 1 || x >= W - d - 1 || y <= d + 1 || y >= H - d - 1) continue;
        const ok = d === 0 || (map[x - d][y - d] >= o.layer && map[x - d][y + d] >= o.layer &&
                               map[x + d][y - d] >= o.layer && map[x + d][y + d] >= o.layer);
        if (ok && R.int(1, 101) < o.saturation) result.objects.push({ name: o.name, x, y });
      }
  return result;
}
