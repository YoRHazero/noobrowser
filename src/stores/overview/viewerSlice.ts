import type { StateCreator } from "zustand";
import type { OverviewStoreState } from "./index";
import type {
	OverviewCursorWorldCoordinate,
	OverviewSidebarTab,
	OverviewTooltipMode,
} from "./types";

export interface OverviewViewerSlice {
	showGrid: boolean;
	pendingFlyToTargetId: string | null;
	tooltipMode: OverviewTooltipMode;
	activeSidebarTab: OverviewSidebarTab;
	targetCoordinatePrecision: number;
	cursorWorldCoordinate: OverviewCursorWorldCoordinate | null;
	setShowGrid: (show: boolean) => void;
	requestFlyToTarget: (id: string | null) => void;
	clearPendingFlyToTarget: () => void;
	setTooltipMode: (mode: OverviewTooltipMode) => void;
	setActiveSidebarTab: (tab: OverviewSidebarTab) => void;
	setTargetCoordinatePrecision: (precision: number) => void;
	setCursorWorldCoordinate: (
		coordinate: OverviewCursorWorldCoordinate | null,
	) => void;
	clearCursorWorldCoordinate: () => void;
}

export const createOverviewViewerSlice: StateCreator<
	OverviewStoreState,
	[],
	[],
	OverviewViewerSlice
> = (set) => ({
	showGrid: true,
	pendingFlyToTargetId: null,
	tooltipMode: "footprint",
	activeSidebarTab: "footprints",
	targetCoordinatePrecision: 6,
	cursorWorldCoordinate: null,
	setShowGrid: (show) => set({ showGrid: show }),
	requestFlyToTarget: (id) => set({ pendingFlyToTargetId: id }),
	clearPendingFlyToTarget: () => set({ pendingFlyToTargetId: null }),
	setTooltipMode: (mode) =>
		set((state) => ({
			tooltipMode: mode,
			cursorWorldCoordinate:
				mode === "footprint" ? null : state.cursorWorldCoordinate,
		})),
	setActiveSidebarTab: (tab) => set({ activeSidebarTab: tab }),
	setTargetCoordinatePrecision: (precision) =>
		set({
			targetCoordinatePrecision: Math.max(
				0,
				Math.min(100, Math.trunc(precision)),
			),
		}),
	setCursorWorldCoordinate: (coordinate) =>
		set({ cursorWorldCoordinate: coordinate }),
	clearCursorWorldCoordinate: () => set({ cursorWorldCoordinate: null }),
});
