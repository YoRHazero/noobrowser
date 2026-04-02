import type { StateCreator } from "zustand";
import type { TargetHubMode } from "../shared/types";
import type { TargetHubStore } from "./index";

export interface TargetHubUiSlice {
	mode: TargetHubMode;
	setMode: (mode: TargetHubMode) => void;
	openDock: () => void;
	collapseToIcon: () => void;
}

export const createUiSlice: StateCreator<
	TargetHubStore,
	[],
	[],
	TargetHubUiSlice
> = (set) => ({
	mode: "icon",
	setMode: (mode) =>
		set({
			mode,
			dockVisible: mode === "dock",
		}),
	openDock: () =>
		set({
			mode: "dock",
			dockVisible: true,
		}),
	collapseToIcon: () =>
		set({
			mode: "icon",
			dockVisible: false,
			reveal: "reveal",
		}),
});
