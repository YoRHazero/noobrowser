"use client";

import { useShallow } from "zustand/react/shallow";
import { useFitJobStore } from "../subfeatures/fitJob/store";

export function useFitJobActions() {
	return useFitJobStore(
		useShallow((state) => ({
			openFitJob: state.openJobsDrawer,
			closeFitJob: state.closeJobsDrawer,
			toggleFitJob: state.toggleJobsDrawer,
		})),
	);
}
