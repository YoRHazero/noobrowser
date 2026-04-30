"use client";

export interface SettingsViewModel {
	interpolation: string;
	cameraMode: string;
	sideRail: string;
	cachePolicy: string;
}

export function useSettings(): SettingsViewModel {
	return {
		interpolation: "Linear sampling",
		cameraMode: "Stable center camera",
		sideRail: "Controlled ROI and spectrum rail",
		cachePolicy: "Query cache only",
	};
}
