"use client";

import { useMemo } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useGrismFootprints } from "@/hooks/query/overview";
import { useOverviewStore } from "@/stores/overview";
import { useImageInspectorStore } from "../store";
import { getIncludedFiles } from "../utils/imageInspectorDataUtils";

const HOTKEY_OPTIONS = {
	enableOnFormTags: false,
	preventDefault: true,
} as const;

function getNextBasename({
	basenameList,
	currentBasename,
	step,
}: {
	basenameList: string[];
	currentBasename: string | null;
	step: -1 | 1;
}): string | null {
	if (basenameList.length === 0) {
		return null;
	}

	const currentIndex = currentBasename
		? basenameList.indexOf(currentBasename)
		: 0;
	const safeIndex = currentIndex >= 0 ? currentIndex : 0;
	const nextIndex =
		(safeIndex + step + basenameList.length) % basenameList.length;

	return basenameList[nextIndex] ?? null;
}

export function useImageInspectorBaseLayerHotkeys() {
	const selectedFootprintId = useOverviewStore(
		(state) => state.selectedFootprintId,
	);
	const setActiveBasename = useImageInspectorStore(
		(state) => state.setBaseLayerActiveBasename,
	);
	const footprintsQuery = useGrismFootprints();
	const activeFootprint = useMemo(
		() =>
			selectedFootprintId
				? (footprintsQuery.data?.find(
						(item) => item.id === selectedFootprintId,
					) ?? null)
				: null,
		[selectedFootprintId, footprintsQuery.data],
	);
	const basenameList = useMemo(
		() => getIncludedFiles(activeFootprint?.meta?.included_files),
		[activeFootprint],
	);

	useHotkeys(
		"shift+q",
		(event) => {
			event.preventDefault();
			const nextBasename = getNextBasename({
				basenameList,
				currentBasename:
					useImageInspectorStore.getState().baseLayerActiveBasename,
				step: -1,
			});

			if (nextBasename) {
				setActiveBasename(nextBasename);
			}
		},
		HOTKEY_OPTIONS,
		[basenameList, setActiveBasename],
	);

	useHotkeys(
		"shift+e",
		(event) => {
			event.preventDefault();
			const nextBasename = getNextBasename({
				basenameList,
				currentBasename:
					useImageInspectorStore.getState().baseLayerActiveBasename,
				step: 1,
			});

			if (nextBasename) {
				setActiveBasename(nextBasename);
			}
		},
		HOTKEY_OPTIONS,
		[basenameList, setActiveBasename],
	);
}
