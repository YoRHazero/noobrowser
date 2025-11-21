import { clamp } from "./projection";
import { Texture } from "pixi.js";

export function sort2DArray(arr: number[][]): number[] {
  const flat = arr.flat();
  flat.sort((a, b) => a - b);
  return flat;
}

export function percentileFromSortedArray(
  sortedArr: number[],
  p: number | number[],
  excludeZero = true,
): number | number[] {
  const ps = Array.isArray(p) ? p : [p];

  const baseArr = excludeZero ? sortedArr.filter((v) => v !== 0) : sortedArr;
  const n = baseArr.length;

  if (n === 0) {
    const zeros = ps.map(() => 0);
    return Array.isArray(p) ? zeros : 0;
  }

  const results = ps.map((percentile) => {
    const rank = (percentile / 100) * (n - 1);
    const lowerIndex = Math.floor(rank);
    const upperIndex = Math.ceil(rank);

    if (lowerIndex === upperIndex) {
      return baseArr[lowerIndex];
    }

    const weight = rank - lowerIndex;
    return baseArr[lowerIndex] * (1 - weight) + baseArr[upperIndex] * weight;
  });

  return Array.isArray(p) ? results : results[0];
}

export function normalize2D(
  arr: number[][],
  pmin: number,
  pmax: number,
  sortedArray: number[] | null = null,
  excludeZero: boolean = true,
): number[][] {
  const sorted = sortedArray ?? sort2DArray(arr);
  const [vmin, vmax] = percentileFromSortedArray(sorted, [pmin, pmax], excludeZero) as number[];

  if (vmax <= vmin) {
    return arr.map((row) => row.map(() => 0));
  }

  const invRange = 1 / (vmax - vmin);

  const normalized: number[][] = arr.map((row) =>
    row.map((value) => {
      const t = (value - vmin) * invRange;
      return clamp(t, 0, 1);
    }),
  );

  return normalized;
}

export function scaleToByte(arr: number[][]): Uint8ClampedArray {
  const flat = arr.flat();
  const byteArray = new Uint8ClampedArray(flat.length);
  for (let i = 0; i < flat.length; i++) {
    byteArray[i] = Math.round(clamp(flat[i] * 255, 0, 255));
  }
  return byteArray;
}

export function textureFromGrayscaleData(
  gray: Uint8ClampedArray,
  width: number,
  height: number,
): Texture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get 2D context from canvas");
  }
  const imageData = ctx.createImageData(width, height);
  for (let i = 0; i < gray.length; i++) {
    const grayValue = gray[i];
    const idx = i * 4;
    imageData.data[idx + 0] = grayValue;
    imageData.data[idx + 1] = grayValue;
    imageData.data[idx + 2] = grayValue;
    imageData.data[idx + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
  return Texture.from(canvas);
}

export function textureFromNormData(
  data: number[][],
  width: number,
  height: number,
  pmin: number,
  pmax: number,
  sortedArray: number[] | null = null,
  excludeZero: boolean = true,
): Texture {
  const normalizedData = normalize2D(data, pmin, pmax, sortedArray, excludeZero);
  const byteData = scaleToByte(normalizedData);
  return textureFromGrayscaleData(byteData, width, height);
}
