import type { StateCreator } from "zustand";
import type { TargetHubMode } from "../shared/types";
import type { TargetHubStore } from "./index";

export interface TargetHubUiSlice {
	mode: TargetHubMode;
	setMode: (mode: TargetHubMode) => void;
	openDock: () => void;
	openSheet: () => void;
	returnToDock: () => void;
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
			jobsDrawerOpen: false,
		}),
	openDock: () =>
		set({
			mode: "dock",
			jobsDrawerOpen: false,
		}),
	openSheet: () =>
		set({
			mode: "sheet",
			jobsDrawerOpen: false,
		}),
	returnToDock: () =>
		set({
			mode: "dock",
			jobsDrawerOpen: false,
		}),
	collapseToIcon: () =>
		set({
			mode: "icon",
			reveal: "reveal",
			jobsDrawerOpen: false,
		}),
});
