import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
	createOverviewUiFootprintInteractionSlice,
	type OverviewUiFootprintInteractionSlice,
} from "./footprintInteractionSlice";
import type {
	OverviewCursorWorldCoordinate as OverviewUiCursorWorldCoordinate,
	OverviewHoverAnchor as OverviewUiHoverAnchor,
	OverviewSidebarTab as OverviewUiSidebarTab,
	OverviewTooltipMode as OverviewUiTooltipMode,
} from "./types";
import {
	createOverviewUiViewerSlice,
	type OverviewUiViewerSlice,
} from "./viewerSlice";

export type OverviewUiStoreState = OverviewUiFootprintInteractionSlice &
	OverviewUiViewerSlice;

export type { OverviewUiFootprintInteractionSlice } from "./footprintInteractionSlice";
export type { OverviewUiViewerSlice } from "./viewerSlice";
export type {
	OverviewUiCursorWorldCoordinate,
	OverviewUiHoverAnchor,
	OverviewUiSidebarTab,
	OverviewUiTooltipMode,
};

export const useOverviewUiStore = create<OverviewUiStoreState>()(
	persist(
		(...a) => ({
			...createOverviewUiFootprintInteractionSlice(...a),
			...createOverviewUiViewerSlice(...a),
		}),
		{
			name: "noobrowser-overview-ui-store",
			partialize: (state) => ({
				showGrid: state.showGrid,
				tooltipMode: state.tooltipMode,
				activeSidebarTab: state.activeSidebarTab,
				targetCoordinatePrecision: state.targetCoordinatePrecision,
			}),
		},
	),
);
