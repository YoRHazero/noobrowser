"use client";

import { useFitJobActions } from "../../../../hooks";
import { useShellStore } from "../../../../store/useShellStore";

export function useHeader() {
	const { openFitJob: onOpenFitJob } = useFitJobActions();
	const onReturnToDock = useShellStore((state) => state.returnToDock);

	return {
		onOpenFitJob,
		onReturnToDock,
	};
}
