"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import type { Spectrum1DCanvasEmissionLineModel } from "@/canvas/spectrum1dCanvas";
import type { Spectrum2DCanvasEmissionLineModel } from "@/canvas/spectrum2dCanvas";
import { useSpectrumWorkspaceStore } from "../store";
import { toSpectrumWorkspaceObservedWavelengthUm } from "../utils";

export function useSpectrumWorkspaceCanvasEmissionLines({
	redshift,
}: {
	redshift: number;
}): {
	spectrum1dEmissionLines: Spectrum1DCanvasEmissionLineModel[];
	spectrum2dEmissionLines: Spectrum2DCanvasEmissionLineModel[];
} {
	const { emissionLines, selectedEmissionLineIds } = useSpectrumWorkspaceStore(
		useShallow((state) => ({
			emissionLines: state.emissionLines,
			selectedEmissionLineIds: state.selectedEmissionLineIds,
		})),
	);

	const selectedLines = useMemo(
		() =>
			selectedEmissionLineIds.flatMap((lineId) => {
				const line = emissionLines[lineId];
				return line ? [line] : [];
			}),
		[emissionLines, selectedEmissionLineIds],
	);
	const spectrum1dEmissionLines = useMemo(
		() =>
			selectedLines.map((line) => ({
				id: line.id,
				label: line.name,
				restWavelengthUm: line.restWavelengthUm,
			})),
		[selectedLines],
	);
	const spectrum2dEmissionLines = useMemo(
		() =>
			selectedLines.map((line) => ({
				id: line.id,
				label: line.name,
				observedWavelengthUm: toSpectrumWorkspaceObservedWavelengthUm(
					line.restWavelengthUm,
					redshift,
				),
			})),
		[selectedLines, redshift],
	);

	return {
		spectrum1dEmissionLines,
		spectrum2dEmissionLines,
	};
}
