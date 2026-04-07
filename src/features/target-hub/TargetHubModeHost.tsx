"use client";

import TargetHubBeacon from "./beacon";
import TargetHubDock from "./dock";
import TargetHubSheet from "./sheet";
import { useTargetHubStore } from "./store";

export function TargetHubModeHost() {
	const mode = useTargetHubStore((state) => state.mode);

	if (mode === "icon") {
		return <TargetHubBeacon />;
	}

	if (mode === "dock") {
		return <TargetHubDock />;
	}

	return <TargetHubSheet />;
}
