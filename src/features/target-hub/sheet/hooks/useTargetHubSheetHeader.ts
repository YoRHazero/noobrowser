"use client";

import { useShallow } from "zustand/react/shallow";
import { useTargetHubStore } from "../../store";

export function useTargetHubSheetHeader() {
	return useTargetHubStore(
		useShallow((state) => ({
			onOpenJobs: state.openJobsDrawer,
			onReturnToDock: state.returnToDock,
		})),
	);
}
