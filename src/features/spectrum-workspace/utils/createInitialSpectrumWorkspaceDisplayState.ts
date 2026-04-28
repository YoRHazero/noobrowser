import type { ExtractedSpectrum } from "@/hooks/query/source/schemas";
import {
	SPECTRUM_WORKSPACE_DEFAULT_DISPLAY_STATE,
	SPECTRUM_WORKSPACE_DEFAULT_PERCENTILE_MAX,
	SPECTRUM_WORKSPACE_DEFAULT_PERCENTILE_MIN,
	SPECTRUM_WORKSPACE_DEFAULT_SAMPLE_SOURCE,
} from "../shared/constants";
import type { SpectrumWorkspaceDisplayState } from "../shared/types";
import { resolveSpectrumWorkspacePercentileRange } from "./resolveSpectrumWorkspacePercentileRange";

export function createInitialSpectrumWorkspaceDisplayState(
	extractedSpectrum: ExtractedSpectrum,
): SpectrumWorkspaceDisplayState {
	const percentileRange = resolveSpectrumWorkspacePercentileRange({
		extractedSpectrum,
		collapseWindow: null,
		pmin: SPECTRUM_WORKSPACE_DEFAULT_PERCENTILE_MIN,
		pmax: SPECTRUM_WORKSPACE_DEFAULT_PERCENTILE_MAX,
		sampleSource: SPECTRUM_WORKSPACE_DEFAULT_SAMPLE_SOURCE,
	});

	return {
		...SPECTRUM_WORKSPACE_DEFAULT_DISPLAY_STATE,
		vmin: percentileRange?.min ?? SPECTRUM_WORKSPACE_DEFAULT_DISPLAY_STATE.vmin,
		vmax: percentileRange?.max ?? SPECTRUM_WORKSPACE_DEFAULT_DISPLAY_STATE.vmax,
	};
}
