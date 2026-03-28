import type { StateCreator } from "zustand";
import type { OverviewStoreState } from "./index";

export interface OverviewViewerSlice {
	showGrid: boolean;
	showAtmosphere: boolean;
	pendingFlyToTargetId: string | null;
	setShowGrid: (show: boolean) => void;
	setShowAtmosphere: (show: boolean) => void;
	requestFlyToTarget: (id: string | null) => void;
	clearPendingFlyToTarget: () => void;
}

export const createOverviewViewerSlice: StateCreator<
	OverviewStoreState,
	[],
	[],
	OverviewViewerSlice
> = (set) => ({
	showGrid: true,
	showAtmosphere: true,
	pendingFlyToTargetId: null,
	setShowGrid: (show) => set({ showGrid: show }),
	setShowAtmosphere: (show) => set({ showAtmosphere: show }),
	requestFlyToTarget: (id) => set({ pendingFlyToTargetId: id }),
	clearPendingFlyToTarget: () => set({ pendingFlyToTargetId: null }),
});
