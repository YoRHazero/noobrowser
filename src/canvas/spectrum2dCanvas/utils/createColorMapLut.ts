import type { Spectrum2DCanvasColorMap } from "../api";
import { SPECTRUM_2D_CANVAS_COLOR_MAP_STOPS } from "../shared/constants";

function parseHexColor(color: string): [number, number, number] {
	const normalized = color.replace("#", "");
	return [
		Number.parseInt(normalized.slice(0, 2), 16),
		Number.parseInt(normalized.slice(2, 4), 16),
		Number.parseInt(normalized.slice(4, 6), 16),
	];
}

function lerpChannel(start: number, end: number, t: number): number {
	return Math.round(start + (end - start) * t);
}

export function createColorMapLut(
	colorMap: Spectrum2DCanvasColorMap,
	size = 256,
): Uint8Array {
	const stops = SPECTRUM_2D_CANVAS_COLOR_MAP_STOPS[colorMap];
	const lut = new Uint8Array(size * 4);

	for (let index = 0; index < size; index += 1) {
		const t = size === 1 ? 0 : index / (size - 1);
		let stopIndex = 1;
		while (stopIndex < stops.length && t > stops[stopIndex][0]) {
			stopIndex += 1;
		}

		const previousStop = stops[Math.max(0, stopIndex - 1)];
		const nextStop = stops[Math.min(stops.length - 1, stopIndex)];
		const span = Math.max(nextStop[0] - previousStop[0], Number.EPSILON);
		const localT = (t - previousStop[0]) / span;
		const [startR, startG, startB] = parseHexColor(previousStop[1]);
		const [endR, endG, endB] = parseHexColor(nextStop[1]);
		const offset = index * 4;

		lut[offset] = lerpChannel(startR, endR, localT);
		lut[offset + 1] = lerpChannel(startG, endG, localT);
		lut[offset + 2] = lerpChannel(startB, endB, localT);
		lut[offset + 3] = 255;
	}

	return lut;
}
