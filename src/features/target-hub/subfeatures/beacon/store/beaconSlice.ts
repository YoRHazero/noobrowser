import type { StateCreator } from "zustand";
import type { BeaconRevealState } from "../../../shared/types";
import type { TargetHubStore } from "../../../store";

export interface TargetHubBeaconSlice {
	reveal: BeaconRevealState;
	setReveal: (reveal: BeaconRevealState) => void;
}

export const createBeaconSlice: StateCreator<
	TargetHubStore,
	[],
	[],
	TargetHubBeaconSlice
> = (set) => ({
	reveal: "hidden",
	setReveal: (reveal) => set({ reveal }),
});
