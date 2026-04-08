"use client";

import Beacon from "./beacon";
import Dock from "./dock";
import Sheet from "./sheet";
import { useShellStore } from "./store/useShellStore";

export function ModeHost() {
	const mode = useShellStore((state) => state.mode);

	if (mode === "icon") {
		return <Beacon />;
	}

	if (mode === "dock") {
		return <Dock />;
	}

	return <Sheet />;
}
