"use client";

import { useShallow } from "zustand/react/shallow";
import { useSourceStore } from "@/stores/source";
import {
	type SpectrumWorkspaceReadyResult,
	useSpectrumWorkspaceReady,
} from "./hooks/useSpectrumWorkspaceReady";
import { useWorkspaceSpectrumData } from "./hooks/useWorkspaceSpectrumData";

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

export type SpectrumWorkspaceViewModel =
	| SpectrumWorkspaceReadyResult
	| SpectrumWorkspaceMessageResult;

export function useSpectrumWorkspace(): SpectrumWorkspaceViewModel {
	const activeSource = useSourceStore(
		useShallow(
			(state) =>
				state.sources.find((source) => source.id === state.activeSourceId) ??
				null,
		),
	);
	const workspaceData = useWorkspaceSpectrumData({
		source: activeSource,
	});
	const extractedSpectrum =
		workspaceData.state === "ready" ? workspaceData.extractedSpectrum : null;
	const readyModel = useSpectrumWorkspaceReady({
		source: activeSource,
		extractedSpectrum,
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

	return readyModel;
}
