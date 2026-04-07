"use client";

import { TargetHubJobsDrawerShellView } from "./components/TargetHubJobsDrawerShellView";
import { useTargetHubJobsDrawerShell } from "./hooks/useTargetHubJobsDrawerShell";

export function TargetHubJobsDrawerShell() {
	const { open, onClose } = useTargetHubJobsDrawerShell();

	return <TargetHubJobsDrawerShellView open={open} onClose={onClose} />;
}
