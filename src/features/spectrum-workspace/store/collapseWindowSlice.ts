"use client";

import type { StateCreator } from "zustand";
import type { Spectrum2DCanvasCollapseWindow } from "@/canvas/spectrum2dCanvas";
import type { SpectrumWorkspaceStore } from "./index";

export interface SpectrumWorkspaceCollapseWindowSlice {
	collapseWindow: Spectrum2DCanvasCollapseWindow | null;
	initializeCollapseWindow: (window: Spectrum2DCanvasCollapseWindow) => void;
	setCollapseWindow: (window: Spectrum2DCanvasCollapseWindow) => void;
	commitCollapseWindowEdit: (window: Spectrum2DCanvasCollapseWindow) => void;
	reconcileCollapseWindow: (window: Spectrum2DCanvasCollapseWindow) => void;
	setOutlineVisible: (value: boolean) => void;
}

export const createSpectrumWorkspaceCollapseWindowSlice: StateCreator<
	SpectrumWorkspaceStore,
	[],
	[],
	SpectrumWorkspaceCollapseWindowSlice
> = (set) => ({
	collapseWindow: null,
	initializeCollapseWindow: (collapseWindow) =>
		set((state) =>
			state.collapseWindow === null ? { collapseWindow } : state,
		),
	setCollapseWindow: (collapseWindow) => set({ collapseWindow }),
	commitCollapseWindowEdit: (collapseWindow) => set({ collapseWindow }),
	reconcileCollapseWindow: (collapseWindow) => set({ collapseWindow }),
	setOutlineVisible: (outlineVisible) =>
		set((state) => ({
			collapseWindow: state.collapseWindow
				? { ...state.collapseWindow, outlineVisible }
				: state.collapseWindow,
		})),
});
