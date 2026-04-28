import type {
	Spectrum2DCanvasCollapseWindow,
	Spectrum2DCanvasDisplayModel,
	Spectrum2DCanvasNorm,
} from "@/canvas/spectrum2dCanvas";
import type { ExtractedSpectrum } from "@/hooks/query/source/schemas";
import {
	SPECTRUM_WORKSPACE_ASINH_SOFTNESS,
	SPECTRUM_WORKSPACE_LOG_FLOOR,
} from "../shared/constants";
import type { SpectrumWorkspaceDisplayState } from "../shared/types";
import { resolveSpectrumWorkspacePercentileRange } from "./resolveSpectrumWorkspacePercentileRange";

function resolveDisplayNorm({
	normKind,
	min,
	max,
}: {
	normKind: SpectrumWorkspaceDisplayState["normKind"];
	min: number;
	max: number;
}): Spectrum2DCanvasNorm {
	switch (normKind) {
		case "log":
			return {
				kind: "log",
				min,
				max,
				floor: SPECTRUM_WORKSPACE_LOG_FLOOR,
			};
		case "asinh":
			return {
				kind: "asinh",
				min,
				max,
				softness: SPECTRUM_WORKSPACE_ASINH_SOFTNESS,
			};
		default:
			return {
				kind: "linear",
				min,
				max,
			};
	}
}

export function resolveSpectrumWorkspaceDisplay({
	displayState,
	extractedSpectrum,
	collapseWindow,
}: {
	displayState: SpectrumWorkspaceDisplayState;
	extractedSpectrum: ExtractedSpectrum | null;
	collapseWindow: Spectrum2DCanvasCollapseWindow | null;
}): Spectrum2DCanvasDisplayModel {
	let min = displayState.vmin;
	let max = displayState.vmax;

	if (displayState.rangeMode === "percentile" && extractedSpectrum) {
		const percentileRange = resolveSpectrumWorkspacePercentileRange({
			extractedSpectrum,
			collapseWindow,
			pmin: displayState.pmin,
			pmax: displayState.pmax,
			sampleSource: displayState.sampleSource,
		});
		if (percentileRange) {
			min = percentileRange.min;
			max = percentileRange.max;
		}
	}

	const resolvedMax = max > min ? max : min + 1e-6;

	return {
		colorMap: displayState.colorMap,
		interpolation: "nearest",
		norm: resolveDisplayNorm({
			normKind: displayState.normKind,
			min,
			max: resolvedMax,
		}),
	};
}
