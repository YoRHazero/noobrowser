import type { StateCreator } from "zustand";
import type { OverviewStoreState } from "./index";
import type { OverviewHoverAnchor } from "./types";

export interface OverviewFootprintSlice {
	selectedFootprintId: string | null;
	hoveredFootprintId: string | null;
	hoveredFootprintAnchor: OverviewHoverAnchor | null;
	setSelectedFootprintId: (id: string | null) => void;
	setHoveredFootprint: (
		id: string | null,
		anchor?: OverviewHoverAnchor | null,
	) => void;
	clearHoveredFootprint: () => void;
	clearFootprintSelection: () => void;
}

export const createOverviewFootprintSlice: StateCreator<
	OverviewStoreState,
	[],
	[],
	OverviewFootprintSlice
> = (set) => ({
	selectedFootprintId: null,
	hoveredFootprintId: null,
	hoveredFootprintAnchor: null,
	setSelectedFootprintId: (id) => set({ selectedFootprintId: id }),
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
	clearFootprintSelection: () => set({ selectedFootprintId: null }),
});
