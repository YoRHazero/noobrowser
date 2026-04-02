import type { StateCreator } from "zustand";
import type { BeaconEffect, BeaconEffectKind } from "../shared/types";
import type { TargetHubStore } from "./index";

export interface TargetHubFeedbackSlice {
	effect: BeaconEffect | null;
	emitEffect: (kind: BeaconEffectKind, color: string) => void;
	clearEffect: () => void;
}

export const createFeedbackSlice: StateCreator<
	TargetHubStore,
	[],
	[],
	TargetHubFeedbackSlice
> = (set) => ({
	effect: null,
	emitEffect: (kind, color) =>
		set((state) => ({
			effect: {
				token: (state.effect?.token ?? 0) + 1,
				kind,
				color,
			},
		})),
	clearEffect: () => set({ effect: null }),
});
