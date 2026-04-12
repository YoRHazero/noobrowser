import type { StateCreator } from "zustand";
import type {
	OverviewCursorWorldCoordinate,
	OverviewSidebarTab,
	OverviewTooltipMode,
} from "./types";
import type { OverviewUiStoreState } from "./uiStore";

export interface OverviewUiViewerSlice {
	showGrid: boolean;
	tooltipMode: OverviewTooltipMode;
	activeSidebarTab: OverviewSidebarTab;
	targetCoordinatePrecision: number;
	cursorWorldCoordinate: OverviewCursorWorldCoordinate | null;
	setShowGrid: (show: boolean) => void;
	setTooltipMode: (mode: OverviewTooltipMode) => void;
	setActiveSidebarTab: (tab: OverviewSidebarTab) => void;
	setTargetCoordinatePrecision: (precision: number) => void;
	setCursorWorldCoordinate: (
		coordinate: OverviewCursorWorldCoordinate | null,
	) => void;
	clearCursorWorldCoordinate: () => void;
}

export const createOverviewUiViewerSlice: StateCreator<
	OverviewUiStoreState,
	[],
	[],
	OverviewUiViewerSlice
> = (set) => ({
	showGrid: true,
	tooltipMode: "footprint",
	activeSidebarTab: "footprints",
	targetCoordinatePrecision: 6,
	cursorWorldCoordinate: null,
	setShowGrid: (show) => set({ showGrid: show }),
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
