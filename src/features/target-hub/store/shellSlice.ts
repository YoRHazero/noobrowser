import type { StateCreator } from "zustand";
import type { TargetHubMode } from "../shared/types";
import type { TargetHubStore } from "./index";

export interface TargetHubShellSlice {
	mode: TargetHubMode;
	setMode: (mode: TargetHubMode) => void;
	openDock: () => void;
	openSheet: () => void;
	returnToDock: () => void;
	collapseToIcon: () => void;
}

export const createShellSlice: StateCreator<
	TargetHubStore,
	[],
	[],
	TargetHubShellSlice
> = (set, get) => ({
	mode: "icon",
	setMode: (mode) => {
		set({ mode });
		get().closeJobsDrawer();
	},
	openDock: () => {
		set({ mode: "dock" });
		get().closeJobsDrawer();
	},
	openSheet: () => {
		set({ mode: "sheet" });
		get().closeJobsDrawer();
	},
	returnToDock: () => {
		set({ mode: "dock" });
		get().closeJobsDrawer();
	},
	collapseToIcon: () => {
		set({
			mode: "icon",
			reveal: "reveal",
		});
		get().closeJobsDrawer();
	},
});
