"use client";

import { useSheetActions } from "../../hooks";

export function useHeader() {
	const { openFitJob, returnToDock } = useSheetActions();

	return {
		onOpenFitJob: openFitJob,
		onReturnToDock: returnToDock,
	};
}
