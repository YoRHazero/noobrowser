"use client";

import { useFitJobActions } from "../../../hooks";
import { useShellStore } from "../../../store/useShellStore";

export function useSheetActions() {
	const { openFitJob } = useFitJobActions();
	const returnToDock = useShellStore((state) => state.returnToDock);

	return {
		openFitJob,
		returnToDock,
	};
}
