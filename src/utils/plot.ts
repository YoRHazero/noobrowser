import { clamp } from "./projection";
import { Texture } from "pixi.js";
export function percentile2D(arr: number[][], p: number, exclude_zero: boolean = true) : number {
    const flat = arr.flat().filter(v => !exclude_zero || v !== 0);
    if (flat.length === 0) return 0;
    flat.sort((a, b) => a - b);
    const rank = (p / 100) * (flat.length - 1);
    const lowerIndex = Math.floor(rank);
    const upperIndex = Math.ceil(rank);
    if (lowerIndex === upperIndex) {
        return flat[lowerIndex];
    } else {
        const weight = rank - lowerIndex;
        return flat[lowerIndex] * (1 - weight) + flat[upperIndex] * weight;
    }
}

export function normalize2D(arr: number[][], pmin: number, pmax: number) : number[][] {
    const minVal = percentile2D(arr, pmin);
    const maxVal = percentile2D(arr, pmax);
    const range = maxVal - minVal;
    return arr.map(row => 
        row.map(value => clamp((value - minVal) / range, 0, 1))
    );
}

export function scaleToByte(arr: number[][]) : Uint8ClampedArray {
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
    height: number
) : Texture {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error("Failed to get 2D context from canvas");
    }
    const imageData = ctx.createImageData(width, height);
    for (let i = 0; i < gray.length; i++) {
        const grayValue = gray[i];
        imageData.data[i * 4 + 0] = grayValue; // R
        imageData.data[i * 4 + 1] = grayValue; // G
        imageData.data[i * 4 + 2] = grayValue; // B
        imageData.data[i * 4 + 3] = 255;       // A
    }
    ctx.putImageData(imageData, 0, 0);
    return Texture.from(canvas);
}

export function textureFromNormData (
    data: number[][],
    width: number,
    height: number,
    pmin: number,
    pmax: number
) : Texture {
    const normalizedData = normalize2D(data, pmin, pmax);   
    const byteData = scaleToByte(normalizedData);
    return textureFromGrayscaleData(byteData, width, height);
}