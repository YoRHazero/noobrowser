"use client";

import type { StateCreator } from "zustand";
import {
	SPECTRUM_WORKSPACE_DEFAULT_REDSHIFT,
	SPECTRUM_WORKSPACE_DEFAULT_REDSHIFT_STEP,
	SPECTRUM_WORKSPACE_DEFAULT_WAVELENGTH_FRAME,
	SPECTRUM_WORKSPACE_DEFAULT_WAVELENGTH_UNIT,
	SPECTRUM_WORKSPACE_MIN_REDSHIFT,
} from "../shared/constants";
import type {
	SpectrumWorkspaceWavelengthFrame,
	SpectrumWorkspaceWavelengthUnit,
} from "../shared/types";
import type { SpectrumWorkspaceStore } from "./index";

function clampRedshift(redshift: number): number {
	if (!Number.isFinite(redshift)) {
		return SPECTRUM_WORKSPACE_DEFAULT_REDSHIFT;
	}

	return Math.max(redshift, SPECTRUM_WORKSPACE_MIN_REDSHIFT);
}

function clampRedshiftStep(redshiftStep: number): number {
	if (!Number.isFinite(redshiftStep) || redshiftStep <= 0) {
		return SPECTRUM_WORKSPACE_DEFAULT_REDSHIFT_STEP;
	}

	return redshiftStep;
}

export interface SpectrumWorkspaceWavelengthDisplaySlice {
	wavelengthDisplaySourceId: string | null;
	redshift: number;
	redshiftStep: number;
	wavelengthFrame: SpectrumWorkspaceWavelengthFrame;
	wavelengthUnit: SpectrumWorkspaceWavelengthUnit;
	syncSourceWavelengthDisplay: (
		sourceId: string | null,
		sourceRedshift: number | null | undefined,
	) => void;
	setRedshift: (redshift: number) => void;
	setRedshiftStep: (redshiftStep: number) => void;
	setWavelengthFrame: (
		wavelengthFrame: SpectrumWorkspaceWavelengthFrame,
	) => void;
	setWavelengthUnit: (wavelengthUnit: SpectrumWorkspaceWavelengthUnit) => void;
}

export const createSpectrumWorkspaceWavelengthDisplaySlice: StateCreator<
	SpectrumWorkspaceStore,
	[],
	[],
	SpectrumWorkspaceWavelengthDisplaySlice
> = (set) => ({
	wavelengthDisplaySourceId: null,
	redshift: SPECTRUM_WORKSPACE_DEFAULT_REDSHIFT,
	redshiftStep: SPECTRUM_WORKSPACE_DEFAULT_REDSHIFT_STEP,
	wavelengthFrame: SPECTRUM_WORKSPACE_DEFAULT_WAVELENGTH_FRAME,
	wavelengthUnit: SPECTRUM_WORKSPACE_DEFAULT_WAVELENGTH_UNIT,
	syncSourceWavelengthDisplay: (sourceId, sourceRedshift) =>
		set((state) => {
			if (state.wavelengthDisplaySourceId === sourceId) {
				return state;
			}

			return {
				wavelengthDisplaySourceId: sourceId,
				redshift: clampRedshift(sourceRedshift ?? 0),
			};
		}),
	setRedshift: (redshift) => set({ redshift: clampRedshift(redshift) }),
	setRedshiftStep: (redshiftStep) =>
		set({ redshiftStep: clampRedshiftStep(redshiftStep) }),
	setWavelengthFrame: (wavelengthFrame) =>
		set({
			wavelengthFrame: wavelengthFrame === "rest" ? "rest" : "observed",
		}),
	setWavelengthUnit: (wavelengthUnit) =>
		set({
			wavelengthUnit: wavelengthUnit === "angstrom" ? "angstrom" : "um",
		}),
});
