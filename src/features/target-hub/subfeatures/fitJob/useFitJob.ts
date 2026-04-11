"use client";

import { useShallow } from "zustand/react/shallow";
import { useFitJobStore } from "./store/useFitJobStore";

export function useFitJob() {
	return useFitJobStore(
		useShallow((state) => ({
			open: state.jobsDrawerOpen,
			onClose: state.closeJobsDrawer,
		})),
	);
}
