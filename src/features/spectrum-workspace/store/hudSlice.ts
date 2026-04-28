"use client";

import type { StateCreator } from "zustand";
import { SPECTRUM_WORKSPACE_DEFAULT_HUD_TAB } from "../shared/constants";
import type { SpectrumWorkspaceHudTab } from "../shared/types";
import type { SpectrumWorkspaceStore } from "./index";

export interface SpectrumWorkspaceHudSlice {
	hudOpen: boolean;
	hudTab: SpectrumWorkspaceHudTab;
	setHudOpen: (value: boolean) => void;
	setHudTab: (value: SpectrumWorkspaceHudTab) => void;
}

export const createSpectrumWorkspaceHudSlice: StateCreator<
	SpectrumWorkspaceStore,
	[],
	[],
	SpectrumWorkspaceHudSlice
> = (set) => ({
	hudOpen: false,
	hudTab: SPECTRUM_WORKSPACE_DEFAULT_HUD_TAB,
	setHudOpen: (hudOpen) => set({ hudOpen }),
	setHudTab: (hudTab) => set({ hudTab }),
});
