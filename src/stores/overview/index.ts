import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
	createOverviewFootprintSlice,
	type OverviewFootprintSlice,
} from "./footprintSlice";
import {
	createOverviewTargetsSlice,
	type OverviewTargetsSlice,
} from "./targetsSlice";
import {
	createOverviewViewerSlice,
	type OverviewViewerSlice,
} from "./viewerSlice";

export type OverviewStoreState = OverviewFootprintSlice &
	OverviewTargetsSlice &
	OverviewViewerSlice;

export type {
	OverviewCursorWorldCoordinate,
	OverviewHoverAnchor,
	OverviewManualTarget,
	OverviewTooltipMode,
} from "./types";
export type { OverviewFootprintSlice } from "./footprintSlice";
export type { OverviewTargetsSlice } from "./targetsSlice";
export type { OverviewViewerSlice } from "./viewerSlice";

export const useOverviewStore = create<OverviewStoreState>()(
	persist(
		(...a) => ({
			...createOverviewFootprintSlice(...a),
			...createOverviewTargetsSlice(...a),
			...createOverviewViewerSlice(...a),
		}),
		{
			name: "noobrowser-overview-store",
			partialize: (state) => ({
				manualTargets: state.manualTargets,
				tooltipMode: state.tooltipMode,
				targetCoordinatePrecision: state.targetCoordinatePrecision,
			}),
		},
	),
);
