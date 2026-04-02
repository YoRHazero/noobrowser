import type { StateCreator } from "zustand";
import { BEACON_DEFAULT_Y_RATIO } from "../../shared/constants";
import type { BeaconRevealState } from "../../shared/types";
import type { TargetHubStore } from "../../store";

const clampRatio = (ratio: number) => Math.min(1, Math.max(0, ratio));

export interface TargetHubBeaconSlice {
	reveal: BeaconRevealState;
	beaconYRatio: number;
	isDragging: boolean;
	dragStarted: boolean;
	setReveal: (reveal: BeaconRevealState) => void;
	startDrag: () => void;
	markDragStarted: () => void;
	updateBeaconYRatio: (ratio: number) => void;
	endDrag: () => void;
}

export const createBeaconSlice: StateCreator<
	TargetHubStore,
	[],
	[],
	TargetHubBeaconSlice
> = (set) => ({
	reveal: "hidden",
	beaconYRatio: BEACON_DEFAULT_Y_RATIO,
	isDragging: false,
	dragStarted: false,
	setReveal: (reveal) => set({ reveal }),
	startDrag: () =>
		set({
			isDragging: true,
			dragStarted: false,
			reveal: "reveal",
		}),
	markDragStarted: () => set({ dragStarted: true }),
	updateBeaconYRatio: (ratio) =>
		set({
			beaconYRatio: clampRatio(ratio),
		}),
	endDrag: () =>
		set({
			isDragging: false,
			dragStarted: false,
		}),
});
