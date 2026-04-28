"use client";

import { useShallow } from "zustand/react/shallow";
import { useSourceStore } from "@/stores/source";

export function useSpectrumWorkspaceSource() {
	return useSourceStore(
		useShallow(
			(state) =>
				state.sources.find((source) => source.id === state.activeSourceId) ??
				null,
		),
	);
}
