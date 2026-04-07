"use client";

import { useShallow } from "zustand/react/shallow";
import { type SourceVisibilityKey, useSourceStore } from "@/stores/source";
import { useTargetHubStore } from "../../store";

export function useSourcesPanel() {
	const {
		sources,
		activeSourceId,
		setActiveSourceId,
		clearActiveSource,
		deleteSource,
		setSourceVisibility,
	} = useSourceStore(
		useShallow((state) => ({
			sources: state.sources,
			activeSourceId: state.activeSourceId,
			setActiveSourceId: state.setActiveSourceId,
			clearActiveSource: state.clearActiveSource,
			deleteSource: state.deleteSource,
			setSourceVisibility: state.setSourceVisibility,
		})),
	);
	const { setEditorMode } = useTargetHubStore(
		useShallow((state) => ({
			setEditorMode: state.setEditorMode,
		})),
	);

	return {
		sources,
		activeSourceId,
		onSelect: (sourceId: string) => {
			if (activeSourceId === sourceId) {
				clearActiveSource();
				setEditorMode("create");
				return;
			}

			setActiveSourceId(sourceId);
			setEditorMode("detail");
		},
		onToggleVisibility: (sourceId: string, key: SourceVisibilityKey) => {
			const source = useSourceStore
				.getState()
				.sources.find((item) => item.id === sourceId);
			if (!source) {
				return;
			}

			setSourceVisibility(sourceId, key, !source.visibility[key]);
		},
		onDelete: (sourceId: string) => {
			const isActive = activeSourceId === sourceId;
			deleteSource(sourceId);
			if (isActive) {
				setEditorMode("create");
			}
		},
	};
}
