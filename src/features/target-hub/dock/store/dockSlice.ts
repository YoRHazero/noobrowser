import type { StateCreator } from "zustand";
import { DOCK_ANCHOR_OFFSET_Y } from "../../shared/constants";
import type { TargetHubStore } from "../../store";

export interface TargetHubDockSlice {
	dockAnchorOffsetY: number;
	setDockAnchorOffsetY: (offset: number) => void;
}

export const createDockSlice: StateCreator<
	TargetHubStore,
	[],
	[],
	TargetHubDockSlice
> = (set) => ({
	dockAnchorOffsetY: DOCK_ANCHOR_OFFSET_Y,
	setDockAnchorOffsetY: (dockAnchorOffsetY) => set({ dockAnchorOffsetY }),
});
