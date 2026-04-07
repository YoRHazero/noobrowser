import type { StateCreator } from "zustand";
import type { SourceStore } from ".";

export interface SourceSelectionSlice {
	activeSourceId: string | null;
	setActiveSourceId: (sourceId: string | null) => void;
	clearActiveSource: () => void;
}

export const createSourceSelectionSlice: StateCreator<
	SourceStore,
	[],
	[],
	SourceSelectionSlice
> = (set, get) => ({
	activeSourceId: null,
	setActiveSourceId: (sourceId) => {
		if (
			sourceId === null ||
			get().sources.some((source) => source.id === sourceId)
		) {
			set({ activeSourceId: sourceId });
		}
	},
	clearActiveSource: () => set({ activeSourceId: null }),
});
