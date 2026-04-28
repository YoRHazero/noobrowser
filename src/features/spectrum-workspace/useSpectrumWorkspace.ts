"use client";

import {
	useSpectrumWorkspaceSource,
	useSpectrumWorkspaceSourceReconcile,
	useSpectrumWorkspaceWavelengthDisplay,
	useWorkspaceSpectrumData,
} from "./hooks";
import {
	type SpectrumWorkspaceReadyResult,
	useSpectrumWorkspaceReady,
} from "./hooks/useSpectrumWorkspaceReady";
import type {
	SpectrumWorkspaceWavelengthFrame,
	SpectrumWorkspaceWavelengthUnit,
} from "./shared/types";

interface SpectrumWorkspaceMessageResult {
	state:
		| "no-source"
		| "spectrum-idle"
		| "spectrum-committed"
		| "spectrum-pending"
		| "spectrum-error"
		| "spectrum-uncovered"
		| "spectrum-missing";
	message: string;
	detail?: string;
}

interface SpectrumWorkspaceSidebarViewModel {
	sourceName: string;
	redshift: number;
	redshiftStep: number;
	wavelengthFrame: SpectrumWorkspaceWavelengthFrame;
	wavelengthUnit: SpectrumWorkspaceWavelengthUnit;
	onRedshiftChange: (redshift: number) => void;
	onRedshiftStepChange: (redshiftStep: number) => void;
	onWavelengthFrameChange: (
		wavelengthFrame: SpectrumWorkspaceWavelengthFrame,
	) => void;
	onWavelengthUnitChange: (
		wavelengthUnit: SpectrumWorkspaceWavelengthUnit,
	) => void;
}

export type SpectrumWorkspaceViewModel =
	| (SpectrumWorkspaceReadyResult & {
			sidebar: SpectrumWorkspaceSidebarViewModel;
	  })
	| SpectrumWorkspaceMessageResult;

export function useSpectrumWorkspace(): SpectrumWorkspaceViewModel {
	useSpectrumWorkspaceSourceReconcile();
	const activeSource = useSpectrumWorkspaceSource();
	const wavelengthDisplay = useSpectrumWorkspaceWavelengthDisplay({
		source: activeSource,
	});
	const workspaceData = useWorkspaceSpectrumData({
		source: activeSource,
	});
	const extractedSpectrum =
		workspaceData.state === "ready" ? workspaceData.extractedSpectrum : null;
	const readyModel = useSpectrumWorkspaceReady({
		source: activeSource,
		extractedSpectrum,
		wavelengthDisplay: {
			redshift: wavelengthDisplay.redshift,
			redshiftStep: wavelengthDisplay.redshiftStep,
			wavelengthFrame: wavelengthDisplay.wavelengthFrame,
			wavelengthUnit: wavelengthDisplay.wavelengthUnit,
		},
	});

	if (workspaceData.state !== "ready") {
		return workspaceData;
	}

	if (readyModel === null) {
		return {
			state: "spectrum-missing",
			message: "Spectrum data is not available.",
		};
	}

	return {
		...readyModel,
		sidebar: {
			sourceName: activeSource?.label ?? activeSource?.id ?? "Unknown source",
			redshift: wavelengthDisplay.redshift,
			redshiftStep: wavelengthDisplay.redshiftStep,
			wavelengthFrame: wavelengthDisplay.wavelengthFrame,
			wavelengthUnit: wavelengthDisplay.wavelengthUnit,
			onRedshiftChange: wavelengthDisplay.setRedshift,
			onRedshiftStepChange: wavelengthDisplay.setRedshiftStep,
			onWavelengthFrameChange: wavelengthDisplay.setWavelengthFrame,
			onWavelengthUnitChange: wavelengthDisplay.setWavelengthUnit,
		},
	};
}
