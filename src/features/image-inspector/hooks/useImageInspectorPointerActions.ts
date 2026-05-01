"use client";

import { useCallback } from "react";
import type { ImagePointerEvent, Point } from "@/canvas/imageCanvas";
import { useSourcePositionFetcher } from "@/hooks/query/source/useSourcePosition";
import { useGrismStore } from "@/stores/grism";
import type { Source } from "@/stores/source";
import { useSourceStore } from "@/stores/source";

function isRightButtonContextMenu(event: ImagePointerEvent) {
	return event.phase === "contextmenu" && event.button === 2;
}

function isFinitePoint(point: Point) {
	return Number.isFinite(point.x) && Number.isFinite(point.y);
}

async function createSourceAtPoint({
	activeSource,
	point,
	selectedFootprintId,
	fetchSourcePosition,
}: {
	activeSource: Source;
	point: Point;
	selectedFootprintId: string;
	fetchSourcePosition: ReturnType<typeof useSourcePositionFetcher>;
}) {
	if (!isFinitePoint(point)) {
		return null;
	}

	const sourcePosition = await fetchSourcePosition({
		selectedFootprintId,
		x: point.x,
		y: point.y,
	});
	if (!sourcePosition) {
		return null;
	}

	return useSourceStore.getState().createSource({
		tags: activeSource.tags,
		position: {
			x: sourcePosition.x,
			y: sourcePosition.y,
			ra: sourcePosition.ra,
			dec: sourcePosition.dec,
		},
		imageRef: {
			refBasename: sourcePosition.ref_basename,
			footprintId: sourcePosition.group_id ?? selectedFootprintId,
		},
		visibility: {
			...activeSource.visibility,
			inspector: true,
		},
	});
}

export function useImageInspectorPointerActions() {
	const fetchSourcePosition = useSourcePositionFetcher();

	return useCallback(
		(event: ImagePointerEvent) => {
			if (!isRightButtonContextMenu(event)) {
				return;
			}

			const sourceStore = useSourceStore.getState();
			const selectedFootprintId = useGrismStore.getState().selectedFootprintId;
			const activeSource =
				sourceStore.sources.find(
					(source) => source.id === sourceStore.activeSourceId,
				) ?? null;

			if (event.target.kind === "source") {
				if (event.shiftKey) {
					sourceStore.setActiveSourceId(event.target.sourceId);
					return;
				}

				if (event.target.sourceId === sourceStore.activeSourceId) {
					sourceStore.clearActiveSource();
					return;
				}

				sourceStore.deleteSource(event.target.sourceId);
				return;
			}

			if (
				event.target.kind !== "hit-plane" ||
				!activeSource ||
				selectedFootprintId === null
			) {
				return;
			}

			void createSourceAtPoint({
				activeSource,
				point: event.point,
				selectedFootprintId,
				fetchSourcePosition,
			})
				.then((createdSource) => {
					if (!createdSource || event.shiftKey) {
						return;
					}

					useSourceStore.getState().deleteSource(activeSource.id);
				})
				.catch((error: unknown) => {
					console.error("Failed to create image-inspector source", error);
				});
		},
		[fetchSourcePosition],
	);
}
