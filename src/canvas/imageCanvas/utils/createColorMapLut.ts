import { Color } from "three";
import type { ColorMap } from "../api";
import { IMAGE_CANVAS_COLOR_MAP_STOPS } from "../shared/constants";
import { clampValue } from "./clampValue";

const LUT_SIZE = 256;

function interpolateColor(
	stops: readonly (readonly [number, string])[],
	t: number,
) {
	const clamped = clampValue(t, 0, 1);
	let lower = stops[0];
	let upper = stops[stops.length - 1];

	for (let index = 0; index < stops.length - 1; index += 1) {
		const current = stops[index];
		const next = stops[index + 1];
		if (clamped >= current[0] && clamped <= next[0]) {
			lower = current;
			upper = next;
			break;
		}
	}

	const span = Math.max(upper[0] - lower[0], 1e-6);
	const localT = (clamped - lower[0]) / span;
	return new Color(lower[1]).lerp(new Color(upper[1]), localT);
}

export function createColorMapLut(colorMap: ColorMap): Uint8Array {
	const stops = IMAGE_CANVAS_COLOR_MAP_STOPS[colorMap];
	const data = new Uint8Array(LUT_SIZE * 4);

	for (let index = 0; index < LUT_SIZE; index += 1) {
		const color = interpolateColor(stops, index / (LUT_SIZE - 1));
		const offset = index * 4;
		data[offset] = Math.round(color.r * 255);
		data[offset + 1] = Math.round(color.g * 255);
		data[offset + 2] = Math.round(color.b * 255);
		data[offset + 3] = 255;
	}

	return data;
}
