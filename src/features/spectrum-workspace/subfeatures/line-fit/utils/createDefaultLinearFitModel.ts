import type {
	Spectrum1DCanvasLinearFitModel,
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

export function createDefaultLinearFitModel({
	id,
	label,
	range,
}: {
	id: number;
	label: string;
	range: Spectrum1DCanvasWaveRange;
}): Spectrum1DCanvasLinearFitModel {
	const normalizedRange = normalizeRange(range);

	return {
		id,
		kind: "linear",
		label,
		active: true,
		subtractFromSlice: false,
		color: resolveDefaultFitModelColor(`${id}:${label}`),
		range: normalizedRange,
		k: 0,
		b: 0,
		x0Um: 0.5 * (normalizedRange.minUm + normalizedRange.maxUm),
	};
}
