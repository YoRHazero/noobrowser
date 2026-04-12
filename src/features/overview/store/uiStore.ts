import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
	createOverviewUiFootprintInteractionSlice,
	type OverviewUiFootprintInteractionSlice,
} from "./footprintInteractionSlice";
import {
	createOverviewUiViewerSlice,
	type OverviewUiViewerSlice,
} from "./viewerSlice";

export type {
	OverviewCursorWorldCoordinate as OverviewUiCursorWorldCoordinate,
	OverviewHoverAnchor as OverviewUiHoverAnchor,
} from "./types";

export type OverviewUiStoreState = OverviewUiFootprintInteractionSlice &
	OverviewUiViewerSlice;

export type { OverviewUiFootprintInteractionSlice } from "./footprintInteractionSlice";
export type {
	OverviewUiTooltipMode,
	OverviewUiViewerSlice,
} from "./viewerSlice";

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
				targetCoordinatePrecision: state.targetCoordinatePrecision,
			}),
		},
	),
);
