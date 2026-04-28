"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import type {
	Spectrum1DCanvasActions,
	Spectrum1DCanvasEmissionLineModel,
	Spectrum1DCanvasFitModelPatch,
	Spectrum1DCanvasModel,
	Spectrum1DCanvasWaveRange,
} from "@/canvas/spectrum1dCanvas";
import type { Spectrum2DCanvasCollapseWindow } from "@/canvas/spectrum2dCanvas";
import type { ExtractedSpectrum } from "@/hooks/query/source/schemas";
import type { Source } from "@/stores/source";
import type { SpectrumWorkspaceWavelengthDisplayState } from "../shared/types";
import { useSpectrumWorkspaceStore } from "../store";
import { extractCollapsedSpectrum1D } from "../utils/extractCollapsedSpectrum1D";

function areWaveRangesEqual(
	left: Spectrum1DCanvasWaveRange,
	right: Spectrum1DCanvasWaveRange,
): boolean {
	return left.minUm === right.minUm && left.maxUm === right.maxUm;
}

function getPointRange(
	points: readonly { wavelengthUm: number }[],
): Spectrum1DCanvasWaveRange | null {
	if (points.length === 0) {
		return null;
	}

	let minUm = Number.POSITIVE_INFINITY;
	let maxUm = Number.NEGATIVE_INFINITY;
	for (const point of points) {
		if (!Number.isFinite(point.wavelengthUm)) {
			continue;
		}

		minUm = Math.min(minUm, point.wavelengthUm);
		maxUm = Math.max(maxUm, point.wavelengthUm);
	}

	if (!Number.isFinite(minUm) || !Number.isFinite(maxUm)) {
		return null;
	}

	return { minUm, maxUm };
}

function clampWaveRange(
	range: Spectrum1DCanvasWaveRange,
	dataRange: Spectrum1DCanvasWaveRange,
): Spectrum1DCanvasWaveRange {
	const minBound = Math.min(dataRange.minUm, dataRange.maxUm);
	const maxBound = Math.max(dataRange.minUm, dataRange.maxUm);
	const nextMin = Math.min(Math.max(range.minUm, minBound), maxBound);
	const nextMax = Math.min(Math.max(range.maxUm, minBound), maxBound);

	return {
		minUm: Math.min(nextMin, nextMax),
		maxUm: Math.max(nextMin, nextMax),
	};
}

export interface SourceSpectrum1DCanvasReadyResult {
	model: Spectrum1DCanvasModel;
	actions?: Spectrum1DCanvasActions;
}

export function useSourceSpectrum1DCanvas({
	source,
	extractedSpectrum,
	collapseWindow,
	wavelengthDisplay,
	emissionLines,
}: {
	source: Source | null;
	extractedSpectrum: ExtractedSpectrum | null;
	collapseWindow: Spectrum2DCanvasCollapseWindow | null;
	wavelengthDisplay: SpectrumWorkspaceWavelengthDisplayState;
	emissionLines: Spectrum1DCanvasEmissionLineModel[];
}): SourceSpectrum1DCanvasReadyResult | null {
	const points = useMemo(
		() =>
			extractedSpectrum && collapseWindow
				? extractCollapsedSpectrum1D(extractedSpectrum, collapseWindow)
				: [],
		[collapseWindow, extractedSpectrum],
	);
	const dataRange = useMemo(() => getPointRange(points), [points]);
	const {
		storedSliceRangeSourceId,
		storedSliceRange,
		reconcileSpectrum1dSliceRange,
		fitConfigurationsBySourceId,
		selectedFitConfigurationIdBySourceId,
		storeUpdateFitModel,
		storeCommitFitModelEdit,
	} = useSpectrumWorkspaceStore(
		useShallow((state) => ({
			storedSliceRangeSourceId: state.spectrum1dSliceRangeSourceId,
			storedSliceRange: state.spectrum1dSliceRange,
			reconcileSpectrum1dSliceRange: state.reconcileSpectrum1dSliceRange,
			fitConfigurationsBySourceId: state.fitConfigurationsBySourceId,
			selectedFitConfigurationIdBySourceId:
				state.selectedFitConfigurationIdBySourceId,
			storeUpdateFitModel: state.updateFitModel,
			storeCommitFitModelEdit: state.commitFitModelEdit,
		})),
	);
	const resolvedSliceRange = useMemo(() => {
		if (!source || dataRange === null) {
			return null;
		}

		if (storedSliceRangeSourceId !== source.id || storedSliceRange === null) {
			return dataRange;
		}

		return clampWaveRange(storedSliceRange, dataRange);
	}, [dataRange, source, storedSliceRange, storedSliceRangeSourceId]);
	const selectedFitConfigurationId = source
		? (selectedFitConfigurationIdBySourceId[source.id] ?? null)
		: null;
	const selectedFitConfiguration = useMemo(() => {
		if (!source || selectedFitConfigurationId === null) {
			return null;
		}

		return (
			(fitConfigurationsBySourceId[source.id] ?? []).find(
				(configuration) => configuration.id === selectedFitConfigurationId,
			) ?? null
		);
	}, [fitConfigurationsBySourceId, selectedFitConfigurationId, source]);
	const fitModels = selectedFitConfiguration?.models ?? [];

	useEffect(() => {
		if (!source || resolvedSliceRange === null) {
			return;
		}

		if (
			storedSliceRangeSourceId !== source.id ||
			storedSliceRange === null ||
			!areWaveRangesEqual(storedSliceRange, resolvedSliceRange)
		) {
			reconcileSpectrum1dSliceRange(source.id, resolvedSliceRange);
		}
	}, [
		reconcileSpectrum1dSliceRange,
		resolvedSliceRange,
		source,
		storedSliceRange,
		storedSliceRangeSourceId,
	]);

	const setSliceRange = useCallback(
		(range: Spectrum1DCanvasWaveRange) => {
			if (!source || dataRange === null) {
				return;
			}

			reconcileSpectrum1dSliceRange(
				source.id,
				clampWaveRange(range, dataRange),
			);
		},
		[dataRange, reconcileSpectrum1dSliceRange, source],
	);
	const updateFitModel = useCallback(
		(modelId: number, patch: Spectrum1DCanvasFitModelPatch) => {
			if (!source || selectedFitConfigurationId === null) {
				return;
			}

			storeUpdateFitModel(
				source.id,
				selectedFitConfigurationId,
				modelId,
				patch,
			);
		},
		[selectedFitConfigurationId, source, storeUpdateFitModel],
	);
	const commitFitModelEdit = useCallback(
		(modelId: number) => {
			if (!source || selectedFitConfigurationId === null) {
				return;
			}

			storeCommitFitModelEdit(source.id, selectedFitConfigurationId, modelId);
		},
		[selectedFitConfigurationId, source, storeCommitFitModelEdit],
	);

	if (points.length === 0 || !source || resolvedSliceRange === null) {
		return null;
	}

	return {
		model: {
			points,
			sliceRange: resolvedSliceRange,
			display: {
				wavelengthUnit: wavelengthDisplay.wavelengthUnit,
				wavelengthFrame: wavelengthDisplay.wavelengthFrame,
				redshift: wavelengthDisplay.redshift,
			},
			fitModels,
			emissionLines,
			labels: {
				accessibilityLabel: `${source.label ?? source.id} spectrum`,
				fluxAxis: "Flux",
				wavelengthAxis: `${
					wavelengthDisplay.wavelengthFrame === "observed" ? "Observed" : "Rest"
				} Wavelength (${
					wavelengthDisplay.wavelengthUnit === "um" ? "um" : "A"
				})`,
			},
		},
		actions: {
			setSliceRange,
			updateFitModel,
			commitFitModelEdit,
		},
	};
}
