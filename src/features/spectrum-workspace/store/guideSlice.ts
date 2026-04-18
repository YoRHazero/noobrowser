"use client";

import type { StateCreator } from "zustand";
import type { SpectrumWorkspaceStore } from "./index";

export interface SpectrumWorkspaceGuideSlice {
	showSpatialCenterLine: boolean;
	setShowSpatialCenterLine: (value: boolean) => void;
}

export const createSpectrumWorkspaceGuideSlice: StateCreator<
	SpectrumWorkspaceStore,
	[],
	[],
	SpectrumWorkspaceGuideSlice
> = (set) => ({
	showSpatialCenterLine: true,
	setShowSpatialCenterLine: (showSpatialCenterLine) =>
		set({ showSpatialCenterLine }),
});
