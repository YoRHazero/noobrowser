import type {
	Spectrum2DCanvasDisplayModel,
	Spectrum2DCanvasLinearNorm,
} from "@/canvas/spectrum2dCanvas";
import type { ExtractedSpectrum } from "@/hooks/query/source/schemas";

const DEFAULT_NORM: Spectrum2DCanvasLinearNorm = {
	kind: "linear",
	min: 0,
	max: 1,
};

function getPercentileIndex(length: number, percentile: number): number {
	if (length <= 1) {
		return 0;
	}

	return Math.min(
		length - 1,
		Math.max(0, Math.round((length - 1) * percentile)),
	);
}

export function getInitialSpectrum2DDisplay(
	extractedSpectrum: ExtractedSpectrum,
): Spectrum2DCanvasDisplayModel {
	const values: number[] = [];
	for (const row of extractedSpectrum.spectrum_2d) {
		for (const value of row) {
			if (Number.isFinite(value)) {
				values.push(value);
			}
		}
	}

	if (values.length === 0) {
		return {
			norm: DEFAULT_NORM,
			colorMap: "gray",
			interpolation: "nearest",
		};
	}

	values.sort((left, right) => left - right);
	const min = values[getPercentileIndex(values.length, 0.05)] ?? values[0] ?? 0;
	const max =
		values[getPercentileIndex(values.length, 0.95)] ??
		values[values.length - 1] ??
		1;
	const resolvedMin = Number.isFinite(min) ? min : 0;
	const resolvedMax = Number.isFinite(max) ? max : resolvedMin + 1;

	return {
		norm: {
			kind: "linear",
			min: resolvedMin,
			max: resolvedMax > resolvedMin ? resolvedMax : resolvedMin + 1,
		},
		colorMap: "gray",
		interpolation: "nearest",
	};
}
