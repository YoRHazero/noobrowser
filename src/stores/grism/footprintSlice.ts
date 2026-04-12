import type { StateCreator } from "zustand";
import type { GrismStoreState } from "./index";

export interface GrismFootprintSlice {
	selectedFootprintId: string | null;
	setSelectedFootprintId: (id: string | null) => void;
	clearFootprintSelection: () => void;
}

export const createGrismFootprintSlice: StateCreator<
	GrismStoreState,
	[],
	[],
	GrismFootprintSlice
> = (set) => ({
	selectedFootprintId: null,
	setSelectedFootprintId: (id) => set({ selectedFootprintId: id }),
	clearFootprintSelection: () => set({ selectedFootprintId: null }),
});
