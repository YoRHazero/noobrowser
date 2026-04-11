import type { StateCreator } from "zustand";
import type { TargetHubStore } from "../../../../store";

export interface TargetHubNedSlice {
	nedRadiusArcsec: number;
	setNedRadiusArcsec: (radiusArcsec: number) => void;
}

export const createNedSlice: StateCreator<
	TargetHubStore,
	[],
	[],
	TargetHubNedSlice
> = (set) => ({
	nedRadiusArcsec: 2,
	setNedRadiusArcsec: (radiusArcsec) =>
		set({
			nedRadiusArcsec: radiusArcsec,
		}),
});
