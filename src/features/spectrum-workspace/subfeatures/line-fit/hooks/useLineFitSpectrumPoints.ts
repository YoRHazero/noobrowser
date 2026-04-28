"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import type { Spectrum1DCanvasPoint } from "@/canvas/spectrum1dCanvas";
import type { Source } from "@/stores/source";
import { useWorkspaceSpectrumData } from "../../../hooks/useWorkspaceSpectrumData";
import { useSpectrumWorkspaceStore } from "../../../store";
import { extractCollapsedSpectrum1D } from "../../../utils/extractCollapsedSpectrum1D";

export function useLineFitSpectrumPoints(
	source: Source | null,
): Spectrum1DCanvasPoint[] {
	const spectrumData = useWorkspaceSpectrumData({ source });
	const collapseWindow = useSpectrumWorkspaceStore(
		useShallow((state) => state.collapseWindow),
	);

	return useMemo(
		() =>
			spectrumData.state === "ready" && collapseWindow !== null
				? extractCollapsedSpectrum1D(
						spectrumData.extractedSpectrum,
						collapseWindow,
					)
				: [],
		[collapseWindow, spectrumData],
	);
}
