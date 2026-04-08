"use client";

import { useFitJobStore } from "../../fitJob/store/useFitJobStore";
import { useShellStore } from "../../store/useShellStore";

export function useHeader() {
	const onOpenJobs = useFitJobStore((state) => state.openJobsDrawer);
	const onReturnToDock = useShellStore((state) => state.returnToDock);

	return {
		onOpenJobs,
		onReturnToDock,
	};
}
