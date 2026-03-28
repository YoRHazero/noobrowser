import type { StateCreator } from "zustand";
import type { OverviewStoreState } from "./index";
import type { OverviewManualTarget } from "./types";

export interface OverviewTargetsSlice {
	manualTargets: OverviewManualTarget[];
	addManualTarget: (target: OverviewManualTarget) => void;
	updateManualTarget: (
		id: string,
		patch: Partial<OverviewManualTarget>,
	) => void;
	removeManualTarget: (id: string) => void;
	clearManualTargets: () => void;
}

export const createOverviewTargetsSlice: StateCreator<
	OverviewStoreState,
	[],
	[],
	OverviewTargetsSlice
> = (set) => ({
	manualTargets: [],
	addManualTarget: (target) =>
		set((state) => ({
			manualTargets: [...state.manualTargets, target],
		})),
	updateManualTarget: (id, patch) =>
		set((state) => ({
			manualTargets: state.manualTargets.map((target) =>
				target.id === id ? { ...target, ...patch } : target,
			),
		})),
	removeManualTarget: (id) =>
		set((state) => ({
			manualTargets: state.manualTargets.filter((target) => target.id !== id),
		})),
	clearManualTargets: () => set({ manualTargets: [] }),
});
