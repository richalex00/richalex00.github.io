// Intrinsic pixel size of an image in public/, read at build time so each <img>
// reserves its box before it loads (no layout shift). CSS still sets the
// displayed size; width/height here only give the browser the aspect ratio.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { imageMetadata } from "astro/assets/utils";

const cache = new Map<string, Promise<{ width: number; height: number }>>();

export const size = (src: string) => {
  if (!cache.has(src)) {
    cache.set(src, imageMetadata(readFileSync(join(process.cwd(), "public", src)), src).then(({ width, height }) => ({ width, height })));
  }
  return cache.get(src)!;
};
