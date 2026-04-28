import type { Spectrum2DCanvasCollapseWindow } from "@/canvas/spectrum2dCanvas";
import type { ExtractedSpectrum } from "@/hooks/query/source/schemas";
import type { SpectrumWorkspaceDisplaySampleSource } from "../shared/types";
import { extractSpectrum2DDisplaySampleValues } from "./extractSpectrum2DDisplaySampleValues";
import { getPercentileValue } from "./getPercentileValue";

export function resolveSpectrumWorkspacePercentileRange({
	extractedSpectrum,
	collapseWindow,
	pmin,
	pmax,
	sampleSource,
}: {
	extractedSpectrum: ExtractedSpectrum;
	collapseWindow: Spectrum2DCanvasCollapseWindow | null;
	pmin: number;
	pmax: number;
	sampleSource: SpectrumWorkspaceDisplaySampleSource;
}): { min: number; max: number } | null {
	const values = extractSpectrum2DDisplaySampleValues({
		extractedSpectrum,
		collapseWindow,
		sampleSource,
	});
	if (values.length === 0) {
		return null;
	}

	values.sort((left, right) => left - right);

	const minValue = getPercentileValue({
		values,
		percentile: Math.min(pmin, pmax),
	});
	const maxValue = getPercentileValue({
		values,
		percentile: Math.max(pmin, pmax),
	});
	if (minValue === null || maxValue === null) {
		return null;
	}

	return {
		min: minValue,
		max: maxValue > minValue ? maxValue : minValue + 1e-6,
	};
}
