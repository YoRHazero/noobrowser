"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import type {
	Spectrum2DCanvasCollapseWindow,
	Spectrum2DCanvasColorMap,
	Spectrum2DCanvasDisplayModel,
} from "@/canvas/spectrum2dCanvas";
import type { ExtractedSpectrum } from "@/hooks/query/source/schemas";
import type { Source } from "@/stores/source";
import { SPECTRUM_WORKSPACE_DEFAULT_DISPLAY_STATE } from "../shared/constants";
import type {
	SpectrumWorkspaceDisplayNormKind,
	SpectrumWorkspaceDisplayRangeMode,
	SpectrumWorkspaceDisplaySampleSource,
	SpectrumWorkspaceDisplayState,
} from "../shared/types";
import { useSpectrumWorkspaceStore } from "../store";
import {
	createInitialCollapseWindow,
	createInitialSpectrumWorkspaceDisplayState,
	getSpectrumWorkspaceWaveBounds,
	resolveSpectrumWorkspaceDisplay,
} from "../utils";

function clampValue(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

function clampCollapseWindow(
	window: Spectrum2DCanvasCollapseWindow,
	extractedSpectrum: ExtractedSpectrum,
): Spectrum2DCanvasCollapseWindow {
	const wavelengths = extractedSpectrum.wavelength;
	const waveBounds = getSpectrumWorkspaceWaveBounds(
		wavelengths,
		window.waveMinUm,
	);
	const spatialMaxBound = Math.max(0, extractedSpectrum.spectrum_2d.length - 1);
	const clampedWaveMin = clampValue(
		window.waveMinUm,
		waveBounds.min,
		waveBounds.max,
	);
	const clampedWaveMax = clampValue(
		window.waveMaxUm,
		waveBounds.min,
		waveBounds.max,
	);

	return {
		...window,
		waveMinUm: Math.min(clampedWaveMin, clampedWaveMax),
		waveMaxUm: Math.max(clampedWaveMin, clampedWaveMax),
		spatialMin: clampValue(window.spatialMin, 0, spatialMaxBound),
		spatialMax: clampValue(window.spatialMax, 0, spatialMaxBound),
	};
}

function areCollapseWindowsEqual(
	left: Spectrum2DCanvasCollapseWindow,
	right: Spectrum2DCanvasCollapseWindow,
): boolean {
	return (
		left.waveMinUm === right.waveMinUm &&
		left.waveMaxUm === right.waveMaxUm &&
		left.spatialMin === right.spatialMin &&
		left.spatialMax === right.spatialMax &&
		left.outlineVisible === right.outlineVisible
	);
}

export interface SpectrumWorkspaceControls {
	bounds: {
		waveMinUm: number;
		waveMaxUm: number;
		spatialMin: number;
		spatialMax: number;
	};
	collapseWindow: Spectrum2DCanvasCollapseWindow;
	setCollapseWindow: (window: Spectrum2DCanvasCollapseWindow) => void;
	commitCollapseWindowEdit: (window: Spectrum2DCanvasCollapseWindow) => void;
	display: Spectrum2DCanvasDisplayModel;
	displayState: SpectrumWorkspaceDisplayState;
	setColorMap: (colorMap: Spectrum2DCanvasColorMap) => void;
	setNormKind: (normKind: SpectrumWorkspaceDisplayNormKind) => void;
	setRangeMode: (rangeMode: SpectrumWorkspaceDisplayRangeMode) => void;
	setSampleSource: (sampleSource: SpectrumWorkspaceDisplaySampleSource) => void;
	setPercentileRange: (range: { pmin: number; pmax: number }) => void;
	setAbsoluteRange: (range: { vmin: number; vmax: number }) => void;
	showSpatialCenterLine: boolean;
	setShowSpatialCenterLine: (value: boolean) => void;
	setOutlineVisible: (value: boolean) => void;
}

export function useSpectrumWorkspaceControls({
	source,
	extractedSpectrum,
}: {
	source: Source | null;
	extractedSpectrum: ExtractedSpectrum | null;
}): SpectrumWorkspaceControls | null {
	const isReady = source !== null && extractedSpectrum !== null;
	const {
		storedCollapseWindow,
		storedDisplayState,
		showSpatialCenterLine,
		initializeCollapseWindow,
		storeSetCollapseWindow,
		storeCommitCollapseWindowEdit,
		reconcileCollapseWindow,
		initializeDisplayState,
		setColorMap,
		setNormKind,
		setRangeMode,
		setSampleSource,
		setPercentileRange,
		setAbsoluteRange,
		setShowSpatialCenterLine,
		setOutlineVisible,
	} = useSpectrumWorkspaceStore(
		useShallow((state) => ({
			storedCollapseWindow: state.collapseWindow,
			storedDisplayState: state.displayState,
			showSpatialCenterLine: state.showSpatialCenterLine,
			initializeCollapseWindow: state.initializeCollapseWindow,
			storeSetCollapseWindow: state.setCollapseWindow,
			storeCommitCollapseWindowEdit: state.commitCollapseWindowEdit,
			reconcileCollapseWindow: state.reconcileCollapseWindow,
			initializeDisplayState: state.initializeDisplayState,
			setColorMap: state.setColorMap,
			setNormKind: state.setNormKind,
			setRangeMode: state.setRangeMode,
			setSampleSource: state.setSampleSource,
			setPercentileRange: state.setPercentileRange,
			setAbsoluteRange: state.setAbsoluteRange,
			setShowSpatialCenterLine: state.setShowSpatialCenterLine,
			setOutlineVisible: state.setOutlineVisible,
		})),
	);

	const initialCollapseWindow = useMemo(
		() =>
			isReady
				? createInitialCollapseWindow({ source, extractedSpectrum })
				: {
						waveMinUm: 0,
						waveMaxUm: 0,
						spatialMin: 0,
						spatialMax: 0,
						outlineVisible: true,
					},
		[extractedSpectrum, isReady, source],
	);
	const initialDisplayState = useMemo(
		() =>
			extractedSpectrum
				? createInitialSpectrumWorkspaceDisplayState(extractedSpectrum)
				: SPECTRUM_WORKSPACE_DEFAULT_DISPLAY_STATE,
		[extractedSpectrum],
	);
	const bounds = useMemo(() => {
		if (!extractedSpectrum) {
			return {
				waveMinUm: 0,
				waveMaxUm: 0,
				spatialMin: 0,
				spatialMax: 0,
			};
		}

		const waveBounds = getSpectrumWorkspaceWaveBounds(
			extractedSpectrum.wavelength,
		);

		return {
			waveMinUm: waveBounds.min,
			waveMaxUm: waveBounds.max,
			spatialMin: 0,
			spatialMax: Math.max(0, extractedSpectrum.spectrum_2d.length - 1),
		};
	}, [extractedSpectrum]);
	const collapseWindow = useMemo(
		() =>
			extractedSpectrum && storedCollapseWindow
				? clampCollapseWindow(storedCollapseWindow, extractedSpectrum)
				: initialCollapseWindow,
		[extractedSpectrum, initialCollapseWindow, storedCollapseWindow],
	);
	const displayState = storedDisplayState ?? initialDisplayState;
	const display = useMemo(
		() =>
			resolveSpectrumWorkspaceDisplay({
				displayState,
				extractedSpectrum,
				collapseWindow,
			}),
		[collapseWindow, displayState, extractedSpectrum],
	);

	useEffect(() => {
		if (storedDisplayState === null) {
			initializeDisplayState(initialDisplayState);
		}
	}, [initializeDisplayState, initialDisplayState, storedDisplayState]);

	useEffect(() => {
		if (!extractedSpectrum) {
			return;
		}

		if (storedCollapseWindow === null) {
			initializeCollapseWindow(initialCollapseWindow);
			return;
		}

		if (!areCollapseWindowsEqual(storedCollapseWindow, collapseWindow)) {
			reconcileCollapseWindow(collapseWindow);
		}
	}, [
		collapseWindow,
		extractedSpectrum,
		initialCollapseWindow,
		initializeCollapseWindow,
		reconcileCollapseWindow,
		storedCollapseWindow,
	]);

	const setCollapseWindow = useCallback(
		(window: Spectrum2DCanvasCollapseWindow) => {
			if (!extractedSpectrum) {
				return;
			}

			storeSetCollapseWindow(clampCollapseWindow(window, extractedSpectrum));
		},
		[extractedSpectrum, storeSetCollapseWindow],
	);
	const commitCollapseWindowEdit = useCallback(
		(window: Spectrum2DCanvasCollapseWindow) => {
			if (!extractedSpectrum) {
				return;
			}

			storeCommitCollapseWindowEdit(
				clampCollapseWindow(window, extractedSpectrum),
			);
		},
		[extractedSpectrum, storeCommitCollapseWindowEdit],
	);

	if (!isReady) {
		return null;
	}

	return {
		bounds,
		collapseWindow,
		setCollapseWindow,
		commitCollapseWindowEdit,
		display,
		displayState,
		setColorMap,
		setNormKind,
		setRangeMode,
		setSampleSource,
		setPercentileRange,
		setAbsoluteRange,
		showSpatialCenterLine,
		setShowSpatialCenterLine,
		setOutlineVisible,
	};
}
