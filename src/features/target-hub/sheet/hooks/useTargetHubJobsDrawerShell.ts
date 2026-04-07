"use client";

import { useShallow } from "zustand/react/shallow";
import { useTargetHubStore } from "../../store";

export function useTargetHubJobsDrawerShell() {
	return useTargetHubStore(
		useShallow((state) => ({
			open: state.jobsDrawerOpen,
			onClose: state.closeJobsDrawer,
		})),
	);
}
