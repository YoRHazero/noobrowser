"use client";

import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useSourceStore } from "@/stores/source";
import { useSpectrumWorkspaceStore } from "../store";

export function useSpectrumWorkspaceSourceReconcile() {
	const sourceIds = useSourceStore(
		useShallow((state) => state.sources.map((source) => source.id)),
	);
	const pruneFitStateForMissingSources = useSpectrumWorkspaceStore(
		(state) => state.pruneFitStateForMissingSources,
	);

	useEffect(() => {
		pruneFitStateForMissingSources(sourceIds);
	}, [pruneFitStateForMissingSources, sourceIds]);
}
