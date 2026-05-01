"use client";

import type { StateCreator } from "zustand";
import type { Rect, SourceAnnotation } from "@/canvas/imageCanvas";
import {
	IMAGE_INSPECTOR_DEFAULT_ROI_POSITION,
	IMAGE_INSPECTOR_ROI_SIZE,
} from "../shared/constants";
import type { ImageInspectorStore } from "./index";

interface RoiDelta {
	dx: number;
	dy: number;
}

interface RoiPositionPatch {
	x?: number;
	y?: number;
}

export interface AnnotationLayerSlice {
	annotationLayerRoi: Rect;
	annotationLayerSources: SourceAnnotation[];
	lockROI: boolean;
	upsertAnnotationLayerSource: (source: SourceAnnotation) => void;
	removeAnnotationLayerSource: (sourceId: string) => void;
	clearAnnotationLayerSources: () => void;
	setAnnotationLayerRoiPosition: (patch: RoiPositionPatch) => void;
	moveAnnotationLayerRoiBy: (delta: RoiDelta) => void;
	setLockROI: (lockROI: boolean) => void;
}

function createAnnotationLayerRoi(x: number, y: number): Rect {
	return {
		x,
		y,
		width: IMAGE_INSPECTOR_ROI_SIZE,
		height: IMAGE_INSPECTOR_ROI_SIZE,
	};
}

function resolveCoordinate(
	value: number | undefined,
	fallback: number,
): number {
	return value !== undefined && Number.isFinite(value) ? value : fallback;
}

export const createAnnotationLayerSlice: StateCreator<
	ImageInspectorStore,
	[],
	[],
	AnnotationLayerSlice
> = (set) => ({
	annotationLayerRoi: createAnnotationLayerRoi(
		IMAGE_INSPECTOR_DEFAULT_ROI_POSITION.x,
		IMAGE_INSPECTOR_DEFAULT_ROI_POSITION.y,
	),
	annotationLayerSources: [],
	lockROI: false,
	upsertAnnotationLayerSource: (source) =>
		set((state) => {
			const sourceIndex = state.annotationLayerSources.findIndex(
				(item) => item.id === source.id,
			);

			if (sourceIndex === -1) {
				return {
					annotationLayerSources: [...state.annotationLayerSources, source],
				};
			}

			const nextSources = [...state.annotationLayerSources];
			nextSources[sourceIndex] = source;
			return {
				annotationLayerSources: nextSources,
			};
		}),
	removeAnnotationLayerSource: (sourceId) =>
		set((state) => {
			if (
				!state.annotationLayerSources.some((source) => source.id === sourceId)
			) {
				return {};
			}

			return {
				annotationLayerSources: state.annotationLayerSources.filter(
					(source) => source.id !== sourceId,
				),
			};
		}),
	clearAnnotationLayerSources: () =>
		set((state) =>
			state.annotationLayerSources.length === 0
				? {}
				: { annotationLayerSources: [] },
		),
	setAnnotationLayerRoiPosition: (patch) =>
		set((state) => ({
			annotationLayerRoi: createAnnotationLayerRoi(
				resolveCoordinate(patch.x, state.annotationLayerRoi.x),
				resolveCoordinate(patch.y, state.annotationLayerRoi.y),
			),
		})),
	moveAnnotationLayerRoiBy: ({ dx, dy }) =>
		set((state) => ({
			annotationLayerRoi: createAnnotationLayerRoi(
				state.annotationLayerRoi.x + dx,
				state.annotationLayerRoi.y + dy,
			),
		})),
	setLockROI: (lockROI) => set({ lockROI }),
});
