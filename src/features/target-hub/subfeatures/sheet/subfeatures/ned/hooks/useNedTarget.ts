"use client";

import { useShallow } from "zustand/react/shallow";
import { useSourceStore } from "@/stores/source";
import { useEditorStore } from "../../../store/useEditorStore";

export function useNedTarget() {
	const { editorMode } = useEditorStore(
		useShallow((state) => ({
			editorMode: state.editorMode,
		})),
	);
	const { activeSourceId, sources } = useSourceStore(
		useShallow((state) => ({
			activeSourceId: state.activeSourceId,
			sources: state.sources,
		})),
	);

	const activeSource =
		sources.find((source) => source.id === activeSourceId) ?? null;
	const hasCoordinates =
		editorMode === "detail" &&
		activeSource !== null &&
		activeSource.position.ra !== null &&
		activeSource.position.dec !== null;

	return {
		hasCoordinates,
		ra: hasCoordinates ? (activeSource.position.ra ?? undefined) : undefined,
		dec: hasCoordinates ? (activeSource.position.dec ?? undefined) : undefined,
	};
}
