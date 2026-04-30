"use client";

export interface MaskLayerViewModel {
	modeLabel: string;
	thresholdLabel: string;
	mapEntries: Array<{
		value: string;
		label: string;
		color: string;
	}>;
}

export function useMaskLayer(): MaskLayerViewModel {
	return {
		modeLabel: "Emission mask preview",
		thresholdLabel: "Static threshold: 2.0",
		mapEntries: [
			{
				value: "0",
				label: "Background",
				color: "rgba(148, 163, 184, 0.32)",
			},
			{
				value: "2",
				label: "Candidate region",
				color: "#22d3ee",
			},
		],
	};
}
