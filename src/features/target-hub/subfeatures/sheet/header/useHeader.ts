"use client";

import { useShellStore } from "../../../store/useShellStore";
import { useFitJobStore } from "../../fitJob/store";

export function useHeader() {
	const onOpenJobs = useFitJobStore((state) => state.openJobsDrawer);
	const onReturnToDock = useShellStore((state) => state.returnToDock);

	return {
		onOpenJobs,
		onReturnToDock,
	};
}
