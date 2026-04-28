import type {
	Spectrum1DCanvasGaussianFitModel,
	Spectrum1DCanvasWaveRange,
} from "@/canvas/spectrum1dCanvas";
import { resolveDefaultFitModelColor } from "./resolveDefaultFitModelColor";

function normalizeRange(
	range: Spectrum1DCanvasWaveRange,
): Spectrum1DCanvasWaveRange {
	return {
		minUm: Math.min(range.minUm, range.maxUm),
		maxUm: Math.max(range.minUm, range.maxUm),
	};
}

export function createDefaultGaussianFitModel({
	id,
	label,
	range,
}: {
	id: number;
	label: string;
	range: Spectrum1DCanvasWaveRange;
}): Spectrum1DCanvasGaussianFitModel {
	const normalizedRange = normalizeRange(range);

	return {
		id,
		kind: "gaussian",
		label,
		active: true,
		subtractFromSlice: false,
		color: resolveDefaultFitModelColor(`${id}:${label}`),
		range: normalizedRange,
		amplitude: 0,
		muUm: 0.5 * (normalizedRange.minUm + normalizedRange.maxUm),
		sigmaUm: 0,
	};
}
