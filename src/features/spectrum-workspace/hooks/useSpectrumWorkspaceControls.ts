"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import type {
	Spectrum2DCanvasCollapseWindow,
	Spectrum2DCanvasColorMap,
	Spectrum2DCanvasDisplayModel,
	Spectrum2DCanvasNorm,
} from "@/canvas/spectrum2dCanvas";
import type { ExtractedSpectrum } from "@/hooks/query/source/schemas";
import type { Source } from "@/stores/source";
import { useSpectrumWorkspaceStore } from "../store";
import { createInitialCollapseWindow } from "../utils/createInitialCollapseWindow";
import { getInitialSpectrum2DDisplay } from "../utils/getInitialSpectrum2DDisplay";

const DEFAULT_DISPLAY: Spectrum2DCanvasDisplayModel = {
	norm: { kind: "linear", min: 0, max: 1 },
	colorMap: "gray",
	interpolation: "nearest",
};

function clampValue(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

function clampCollapseWindow(
	window: Spectrum2DCanvasCollapseWindow,
	extractedSpectrum: ExtractedSpectrum,
): Spectrum2DCanvasCollapseWindow {
	const wavelengths = extractedSpectrum.wavelength;
	const firstWave = wavelengths[0] ?? window.waveMinUm;
	const lastWave = wavelengths[wavelengths.length - 1] ?? window.waveMaxUm;
	const spatialMaxBound = Math.max(0, extractedSpectrum.spectrum_2d.length - 1);

	return {
		...window,
		waveMinUm: clampValue(window.waveMinUm, firstWave, lastWave),
		waveMaxUm: clampValue(window.waveMaxUm, firstWave, lastWave),
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
	collapseWindow: Spectrum2DCanvasCollapseWindow;
	setCollapseWindow: (window: Spectrum2DCanvasCollapseWindow) => void;
	commitCollapseWindowEdit: (window: Spectrum2DCanvasCollapseWindow) => void;
	display: Spectrum2DCanvasDisplayModel;
	setNorm: (norm: Spectrum2DCanvasNorm) => void;
	setColorMap: (colorMap: Spectrum2DCanvasColorMap) => void;
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
		storedDisplay,
		showSpatialCenterLine,
		initializeCollapseWindow,
		storeSetCollapseWindow,
		storeCommitCollapseWindowEdit,
		reconcileCollapseWindow,
		initializeDisplay,
		setNorm,
		setColorMap,
		setShowSpatialCenterLine,
		setOutlineVisible,
	} = useSpectrumWorkspaceStore(
		useShallow((state) => ({
			storedCollapseWindow: state.collapseWindow,
			storedDisplay: state.display,
			showSpatialCenterLine: state.showSpatialCenterLine,
			initializeCollapseWindow: state.initializeCollapseWindow,
			storeSetCollapseWindow: state.setCollapseWindow,
			storeCommitCollapseWindowEdit: state.commitCollapseWindowEdit,
			reconcileCollapseWindow: state.reconcileCollapseWindow,
			initializeDisplay: state.initializeDisplay,
			setNorm: state.setNorm,
			setColorMap: state.setColorMap,
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
						outlineVisible: false,
					},
		[extractedSpectrum, isReady, source],
	);
	const initialDisplay = useMemo(
		() =>
			extractedSpectrum
				? getInitialSpectrum2DDisplay(extractedSpectrum)
				: DEFAULT_DISPLAY,
		[extractedSpectrum],
	);
	const collapseWindow = useMemo(
		() =>
			extractedSpectrum && storedCollapseWindow
				? clampCollapseWindow(storedCollapseWindow, extractedSpectrum)
				: initialCollapseWindow,
		[extractedSpectrum, initialCollapseWindow, storedCollapseWindow],
	);
	const display = storedDisplay ?? initialDisplay;

	useEffect(() => {
		if (storedDisplay === null) {
			initializeDisplay(initialDisplay);
		}
	}, [initializeDisplay, initialDisplay, storedDisplay]);

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
		collapseWindow,
		setCollapseWindow,
		commitCollapseWindowEdit,
		display,
		setNorm,
		setColorMap,
		showSpatialCenterLine,
		setShowSpatialCenterLine,
		setOutlineVisible,
	};
}
