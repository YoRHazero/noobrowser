import type { StateCreator } from "zustand";
import type { OverviewStoreState } from "./index";

export interface OverviewViewerSlice {
	showGrid: boolean;
	pendingFlyToTargetId: string | null;
	setShowGrid: (show: boolean) => void;
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
	pendingFlyToTargetId: null,
	setShowGrid: (show) => set({ showGrid: show }),
	requestFlyToTarget: (id) => set({ pendingFlyToTargetId: id }),
	clearPendingFlyToTarget: () => set({ pendingFlyToTargetId: null }),
});
