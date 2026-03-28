import type { OverviewFootprintSlice } from "./types";

export const createOverviewFootprintSlice = (): OverviewFootprintSlice => ({
	selectedFootprintId: null,
	hoveredFootprintId: null,
	hoveredFootprintAnchor: null,
});
