"use client";

import { TargetHubSheetHeaderView } from "./components/TargetHubSheetHeaderView";
import { useTargetHubSheetHeader } from "./hooks/useTargetHubSheetHeader";

export function TargetHubSheetHeader() {
	const { onOpenJobs, onReturnToDock } = useTargetHubSheetHeader();

	return (
		<TargetHubSheetHeaderView
			onOpenJobs={onOpenJobs}
			onReturnToDock={onReturnToDock}
		/>
	);
}
