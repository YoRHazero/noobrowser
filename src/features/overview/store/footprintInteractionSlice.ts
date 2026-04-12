import type { StateCreator } from "zustand";
import type { OverviewHoverAnchor } from "./types";
import type { OverviewUiStoreState } from "./uiStore";

export interface OverviewUiFootprintInteractionSlice {
	hoveredFootprintId: string | null;
	hoveredFootprintAnchor: OverviewHoverAnchor | null;
	setHoveredFootprint: (
		id: string | null,
		anchor?: OverviewHoverAnchor | null,
	) => void;
	clearHoveredFootprint: () => void;
}

export const createOverviewUiFootprintInteractionSlice: StateCreator<
	OverviewUiStoreState,
	[],
	[],
	OverviewUiFootprintInteractionSlice
> = (set) => ({
	hoveredFootprintId: null,
	hoveredFootprintAnchor: null,
	setHoveredFootprint: (id, anchor = null) =>
		set({
			hoveredFootprintId: id,
			hoveredFootprintAnchor: id ? anchor : null,
		}),
	clearHoveredFootprint: () =>
		set({
			hoveredFootprintId: null,
			hoveredFootprintAnchor: null,
		}),
});
