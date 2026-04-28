"use client";

import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import type { Source } from "@/stores/source";
import { useSpectrumWorkspaceStore } from "../store";

export function useSpectrumWorkspaceWavelengthDisplay({
	source,
}: {
	source: Source | null;
}) {
	const wavelengthDisplay = useSpectrumWorkspaceStore(
		useShallow((state) => ({
			redshift: state.redshift,
			redshiftStep: state.redshiftStep,
			wavelengthFrame: state.wavelengthFrame,
			wavelengthUnit: state.wavelengthUnit,
			syncSourceWavelengthDisplay: state.syncSourceWavelengthDisplay,
			setRedshift: state.setRedshift,
			setRedshiftStep: state.setRedshiftStep,
			setWavelengthFrame: state.setWavelengthFrame,
			setWavelengthUnit: state.setWavelengthUnit,
		})),
	);

	useEffect(() => {
		wavelengthDisplay.syncSourceWavelengthDisplay(
			source?.id ?? null,
			source?.z,
		);
	}, [source?.id, source?.z, wavelengthDisplay.syncSourceWavelengthDisplay]);

	return wavelengthDisplay;
}
