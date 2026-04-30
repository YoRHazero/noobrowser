"use client";

import type { StateCreator } from "zustand";
import type { Rect } from "@/canvas/imageCanvas";
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
	lockROI: boolean;
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
	lockROI: false,
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
