"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SPECTRUM_WORKSPACE_STORAGE_KEY } from "../shared/constants";
import {
	createEmissionLineSlice,
	type EmissionLineSlice,
} from "../subfeatures/emission-lines/store";
import {
	createLineFitSlice,
	type LineFitSlice,
} from "../subfeatures/line-fit/store";
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
import {
	createSpectrumWorkspaceHudSlice,
	type SpectrumWorkspaceHudSlice,
} from "./hudSlice";
import {
	createSpectrumWorkspace1DSliceRangeSlice,
	type SpectrumWorkspace1DSliceRangeSlice,
} from "./spectrum1dSliceRangeSlice";
import {
	createSpectrumWorkspaceWavelengthDisplaySlice,
	type SpectrumWorkspaceWavelengthDisplaySlice,
} from "./wavelengthDisplaySlice";

export type SpectrumWorkspaceStore = SpectrumWorkspaceCollapseWindowSlice &
	SpectrumWorkspaceDisplaySlice &
	SpectrumWorkspaceGuideSlice &
	SpectrumWorkspaceHudSlice &
	SpectrumWorkspace1DSliceRangeSlice &
	SpectrumWorkspaceWavelengthDisplaySlice &
	EmissionLineSlice &
	LineFitSlice;

export const useSpectrumWorkspaceStoreBase = create<SpectrumWorkspaceStore>()(
	persist(
		(...args) => ({
			...createSpectrumWorkspaceCollapseWindowSlice(...args),
			...createSpectrumWorkspaceDisplaySlice(...args),
			...createSpectrumWorkspaceGuideSlice(...args),
			...createSpectrumWorkspaceHudSlice(...args),
			...createSpectrumWorkspace1DSliceRangeSlice(...args),
			...createSpectrumWorkspaceWavelengthDisplaySlice(...args),
			...createEmissionLineSlice(...args),
			...createLineFitSlice(...args),
		}),
		{
			name: SPECTRUM_WORKSPACE_STORAGE_KEY,
			partialize: (state) => ({
				emissionLines: state.emissionLines,
				selectedEmissionLineIds: state.selectedEmissionLineIds,
				emissionLinePresets: state.emissionLinePresets,
				selectedEmissionLinePresetName: state.selectedEmissionLinePresetName,
				fitConfigurationsBySourceId: state.fitConfigurationsBySourceId,
				selectedFitConfigurationIdBySourceId:
					state.selectedFitConfigurationIdBySourceId,
			}),
		},
	),
);

export type { EmissionLineSlice } from "../subfeatures/emission-lines/store";
export type { LineFitSlice } from "../subfeatures/line-fit/store";
export type { SpectrumWorkspaceCollapseWindowSlice } from "./collapseWindowSlice";
export type { SpectrumWorkspaceDisplaySlice } from "./displaySlice";
export type { SpectrumWorkspaceGuideSlice } from "./guideSlice";
export type { SpectrumWorkspaceHudSlice } from "./hudSlice";
export type { SpectrumWorkspace1DSliceRangeSlice } from "./spectrum1dSliceRangeSlice";
export { useSpectrumWorkspaceStore } from "./useSpectrumWorkspaceStore";
export type { SpectrumWorkspaceWavelengthDisplaySlice } from "./wavelengthDisplaySlice";
