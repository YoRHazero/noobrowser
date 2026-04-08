import type { StateCreator } from "zustand";
import { DOCK_ANCHOR_OFFSET_Y } from "../shared/constants";
import type { TargetHubMode } from "../shared/types";
import type { TargetHubStore } from "./index";

export interface TargetHubShellSlice {
	mode: TargetHubMode;
	dockAnchorOffsetY: number;
	setMode: (mode: TargetHubMode) => void;
	setDockAnchorOffsetY: (offset: number) => void;
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
	dockAnchorOffsetY: DOCK_ANCHOR_OFFSET_Y,
	setMode: (mode) => {
		set({ mode });
		get().closeJobsDrawer();
	},
	setDockAnchorOffsetY: (dockAnchorOffsetY) => set({ dockAnchorOffsetY }),
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
