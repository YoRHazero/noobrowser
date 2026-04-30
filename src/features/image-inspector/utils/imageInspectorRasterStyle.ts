import { getFloat16 } from "@petamoriken/float16";
import type { Frame, RasterStyle, ScalarData } from "@/canvas/imageCanvas";
import type { BaseLayerNormRangeMode } from "../shared/types";
import type { BaseLayerNormState } from "../store";

function createScalarReader(data: ScalarData): (index: number) => number {
	if (data.dataType === "float16") {
		const view = new DataView(
			data.array.buffer,
			data.array.byteOffset,
			data.array.byteLength,
		);
		return (index) => getFloat16(view, index * 2, true);
	}

	return (index) => data.array[index] ?? Number.NaN;
}

function getPercentileValue(sortedValues: number[], percentile: number) {
	if (sortedValues.length === 0) {
		return null;
	}

	const clampedPercentile = Math.min(100, Math.max(0, percentile));
	const index = Math.round(
		(clampedPercentile / 100) * Math.max(0, sortedValues.length - 1),
	);
	return sortedValues[index] ?? null;
}

function resolvePercentileNorm(data: ScalarData, min: number, max: number) {
	const reader = createScalarReader(data);
	const sampleCount = data.array.length;
	const maxSamples = 65_536;
	const step = Math.max(1, Math.floor(sampleCount / maxSamples));
	const values: number[] = [];

	for (let index = 0; index < sampleCount; index += step) {
		const value = reader(index);
		if (Number.isFinite(value)) {
			values.push(value);
		}
	}

	values.sort((a, b) => a - b);

	const vmin = getPercentileValue(values, min);
	const vmax = getPercentileValue(values, max);
	if (vmin === null || vmax === null) {
		return { vmin: 0, vmax: 1 };
	}

	return { vmin, vmax };
}

function normalizeNormBounds(vmin: number, vmax: number) {
	if (!Number.isFinite(vmin) || !Number.isFinite(vmax)) {
		return { vmin: 0, vmax: 1 };
	}

	if (vmin === vmax) {
		return {
			vmin: vmin - 1,
			vmax: vmax + 1,
		};
	}

	return { vmin, vmax };
}

export function resolveRasterStyle({
	colorMap,
	norm,
	frame,
	fallbackRangeMode,
}: {
	colorMap: RasterStyle["colorMap"];
	norm: BaseLayerNormState;
	frame: Frame | null;
	fallbackRangeMode?: BaseLayerNormRangeMode;
}): RasterStyle {
	const rangeMode = fallbackRangeMode ?? norm.rangeMode;
	const range =
		rangeMode === "percentile" && frame?.data.kind === "scalar"
			? resolvePercentileNorm(frame.data, norm.min, norm.max)
			: {
					vmin: norm.min,
					vmax: norm.max,
				};
	const normalizedRange = normalizeNormBounds(range.vmin, range.vmax);

	return {
		norm: {
			...normalizedRange,
			stretch: norm.stretch,
		},
		colorMap,
	};
}
