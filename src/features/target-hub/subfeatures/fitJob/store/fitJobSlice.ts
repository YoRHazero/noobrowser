import type { StateCreator } from "zustand";
import type { TargetHubStore } from "../../../store";

export interface TargetHubFitJobSlice {
	jobsDrawerOpen: boolean;
	openJobsDrawer: () => void;
	closeJobsDrawer: () => void;
	toggleJobsDrawer: () => void;
}

export const createFitJobSlice: StateCreator<
	TargetHubStore,
	[],
	[],
	TargetHubFitJobSlice
> = (set) => ({
	jobsDrawerOpen: false,
	openJobsDrawer: () => set({ jobsDrawerOpen: true }),
	closeJobsDrawer: () => set({ jobsDrawerOpen: false }),
	toggleJobsDrawer: () =>
		set((state) => ({
			jobsDrawerOpen: !state.jobsDrawerOpen,
		})),
});
