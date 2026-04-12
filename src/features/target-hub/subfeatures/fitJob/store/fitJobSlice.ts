import type { StateCreator } from "zustand";
import type { TargetHubStore } from "../../../store";

export interface TargetHubFitJobSlice {
	jobsDrawerOpen: boolean;
	selectedJobId: string | null;
	openJobsDrawer: () => void;
	closeJobsDrawer: () => void;
	toggleJobsDrawer: () => void;
	selectJob: (jobId: string) => void;
	clearSelectedJob: () => void;
}

export const createFitJobSlice: StateCreator<
	TargetHubStore,
	[],
	[],
	TargetHubFitJobSlice
> = (set) => ({
	jobsDrawerOpen: false,
	selectedJobId: null,
	openJobsDrawer: () => set({ jobsDrawerOpen: true }),
	closeJobsDrawer: () => set({ jobsDrawerOpen: false }),
	toggleJobsDrawer: () =>
		set((state) => ({
			jobsDrawerOpen: !state.jobsDrawerOpen,
		})),
	selectJob: (jobId) =>
		set((state) => ({
			selectedJobId: state.selectedJobId === jobId ? null : jobId,
		})),
	clearSelectedJob: () => set({ selectedJobId: null }),
});
