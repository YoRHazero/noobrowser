"use client";

import { create } from "zustand";
import {
	createSpectrumWorkspaceCollapseWindowSlice,
	type SpectrumWorkspaceCollapseWindowSlice,
} from "./collapseWindowSlice";
import {
	createSpectrumWorkspaceDisplaySlice,
	type SpectrumWorkspaceDisplaySlice,
} from "./displaySlice";
import {
	createSpectrumWorkspaceGuideSlice,
	type SpectrumWorkspaceGuideSlice,
} from "./guideSlice";

export type SpectrumWorkspaceStore = SpectrumWorkspaceCollapseWindowSlice &
	SpectrumWorkspaceDisplaySlice &
	SpectrumWorkspaceGuideSlice;

export const useSpectrumWorkspaceStoreBase = create<SpectrumWorkspaceStore>()(
	(...args) => ({
		...createSpectrumWorkspaceCollapseWindowSlice(...args),
		...createSpectrumWorkspaceDisplaySlice(...args),
		...createSpectrumWorkspaceGuideSlice(...args),
	}),
);

export type { SpectrumWorkspaceCollapseWindowSlice } from "./collapseWindowSlice";
export type { SpectrumWorkspaceDisplaySlice } from "./displaySlice";
export type { SpectrumWorkspaceGuideSlice } from "./guideSlice";
export { useSpectrumWorkspaceStore } from "./useSpectrumWorkspaceStore";
