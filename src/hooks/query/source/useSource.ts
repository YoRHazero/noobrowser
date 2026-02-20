import { useShallow } from "zustand/react/shallow";
import { useAnalyzerStore } from "@/stores/analyzer";
import type { Source } from "@/stores/source/types";
import { useExtractSpectrum } from "./useExtractSpectrum";
import { useSourcePosition } from "./useSourcePosition";

/**
 * Hook to get source position and spectrum data
 * @param source Source object
 * @param apertureSize Optional aperture size for spectrum extraction
 * @param waveMin Optional minimum wavelength for spectrum extraction
 * @param waveMax Optional maximum wavelength for spectrum extraction
 * @param posEnabled Whether to enable position query
 * @param specEnabled Whether to enable spectrum query
 * @returns Object containing positionQuery and spectrumQuery
 */
export function useSource({
	source,
	apertureSize,
	waveMin,
	waveMax,
	posEnabled = false,
	specEnabled = false,
}: {
	source: Source;
	apertureSize?: number;
	waveMin?: number;
	waveMax?: number;
	posEnabled?: boolean;
	specEnabled?: boolean;
}) {
	if (source.groupId === null || source.groupId === undefined) {
		throw new Error("Source must have a valid groupId");
	}

	const positionQuery = useSourcePosition({
		selectedFootprintId: source.groupId,
		x: source.x,
		y: source.y,
		enabled: posEnabled,
	});
	const ra = source.ra ?? positionQuery.data?.ra;
	const dec = source.dec ?? positionQuery.data?.dec;
	const raDecReady = typeof ra === "number" && typeof dec === "number";

	const globalApertureSize = useAnalyzerStore(
		useShallow((state) => state.apertureSize),
	);
	const finalApertureSize = apertureSize ?? globalApertureSize;
	const forwardWaveRange = useAnalyzerStore(
		useShallow((state) => state.forwardWaveRange),
	);
	const finalWaveMin = waveMin ?? forwardWaveRange.min;
	const finalWaveMax = waveMax ?? forwardWaveRange.max;
	const isWaveRangeValid = finalWaveMax > finalWaveMin;

	const spectrumQueryKey = [
		"extract_spectrum",
		source.id,
		finalWaveMin,
		finalWaveMax,
		finalApertureSize,
		ra?.toFixed(10),
		dec?.toFixed(10),
	];
	const spectrumQuery = useExtractSpectrum({
		selectedFootprintId: source.groupId,
		waveMin: finalWaveMin,
		waveMax: finalWaveMax,
		apertureSize: finalApertureSize,
		ra: raDecReady ? ra : undefined,
		dec: raDecReady ? dec : undefined,
		enabled: specEnabled && raDecReady && isWaveRangeValid,
		queryKey: spectrumQueryKey,
	});
	return {
		positionQuery,
		spectrumQuery,
	};
}
