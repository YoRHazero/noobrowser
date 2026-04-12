"use client";

import { useFitJobActions } from "../../../../hooks";
import { useShellStore } from "../../../../store/useShellStore";

export function useHeader() {
	const { openFitJob: onOpenJobs } = useFitJobActions();
	const onReturnToDock = useShellStore((state) => state.returnToDock);

	return {
		onOpenJobs,
		onReturnToDock,
	};
}
