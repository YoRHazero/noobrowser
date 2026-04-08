import type { StateCreator } from "zustand";
import {
	ANCHOR_DEFAULT_Y_RATIO,
	DOCK_OFFSET_Y_FROM_ANCHOR,
} from "../shared/constants";
import type { TargetHubStore } from "./index";

const clampRatio = (ratio: number) => Math.min(1, Math.max(0, ratio));

export interface TargetHubAnchorSlice {
	anchorYRatio: number;
	isAnchorDragging: boolean;
	anchorDragStarted: boolean;
	dockOffsetYFromAnchor: number;
	setDockOffsetYFromAnchor: (offset: number) => void;
	startAnchorDrag: () => void;
	markAnchorDragStarted: () => void;
	updateAnchorYRatio: (ratio: number) => void;
	endAnchorDrag: () => void;
}

export const createAnchorSlice: StateCreator<
	TargetHubStore,
	[],
	[],
	TargetHubAnchorSlice
> = (set) => ({
	anchorYRatio: ANCHOR_DEFAULT_Y_RATIO,
	isAnchorDragging: false,
	anchorDragStarted: false,
	dockOffsetYFromAnchor: DOCK_OFFSET_Y_FROM_ANCHOR,
	setDockOffsetYFromAnchor: (dockOffsetYFromAnchor) =>
		set({ dockOffsetYFromAnchor }),
	startAnchorDrag: () =>
		set({
			isAnchorDragging: true,
			anchorDragStarted: false,
			reveal: "reveal",
		}),
	markAnchorDragStarted: () => set({ anchorDragStarted: true }),
	updateAnchorYRatio: (ratio) =>
		set({
			anchorYRatio: clampRatio(ratio),
		}),
	endAnchorDrag: () =>
		set({
			isAnchorDragging: false,
			anchorDragStarted: false,
		}),
});
