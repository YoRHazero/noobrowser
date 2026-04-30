"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import {
	type Source,
	type SourceVisibilityKey,
	useSourceStore,
} from "@/stores/source";
import { useEditorStore } from "../../store";

export function useSources() {
	const {
		sources,
		activeSourceId,
		selectedGroup,
		setActiveSourceId,
		clearActiveSource,
		deleteSource,
		setSourceVisibility,
		addSourceTag,
		removeSourceTag,
	} = useSourceStore(
		useShallow((state) => ({
			sources: state.sources,
			activeSourceId: state.activeSourceId,
			selectedGroup: state.selectedGroup,
			setActiveSourceId: state.setActiveSourceId,
			clearActiveSource: state.clearActiveSource,
			deleteSource: state.deleteSource,
			setSourceVisibility: state.setSourceVisibility,
			addSourceTag: state.addSourceTag,
			removeSourceTag: state.removeSourceTag,
		})),
	);
	const { setEditorMode } = useEditorStore(
		useShallow((state) => ({
			setEditorMode: state.setEditorMode,
		})),
	);
	const groupedSources = useMemo(() => {
		if (selectedGroup === null) {
			return {
				inGroup: [],
				outsideGroup: [],
			};
		}

		const inGroup: Source[] = [];
		const outsideGroup: Source[] = [];
		for (const source of sources) {
			if (source.tags.includes(selectedGroup)) {
				inGroup.push(source);
			} else {
				outsideGroup.push(source);
			}
		}

		return {
			inGroup,
			outsideGroup,
		};
	}, [selectedGroup, sources]);

	return {
		sources,
		selectedGroup,
		groupedSources,
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
		onAddToSelectedGroup: (sourceId: string) => {
			if (selectedGroup === null) {
				return;
			}

			addSourceTag(sourceId, selectedGroup);
		},
		onRemoveFromSelectedGroup: (sourceId: string) => {
			if (selectedGroup === null) {
				return;
			}

			removeSourceTag(sourceId, selectedGroup);
		},
	};
}
