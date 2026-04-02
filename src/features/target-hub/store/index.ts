import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
	createBeaconSlice,
	type TargetHubBeaconSlice,
} from "../beacon/store/beaconSlice";
import {
	createDockSlice,
	type TargetHubDockSlice,
} from "../dock/store/dockSlice";
import { TARGET_HUB_STORAGE_KEY } from "../shared/constants";
import {
	createFeedbackSlice,
	type TargetHubFeedbackSlice,
} from "./feedbackSlice";
import { createUiSlice, type TargetHubUiSlice } from "./uiSlice";

export type TargetHubStore = TargetHubUiSlice &
	TargetHubFeedbackSlice &
	TargetHubBeaconSlice &
	TargetHubDockSlice;

export const useTargetHubStore = create<TargetHubStore>()(
	persist(
		(...a) => ({
			...createUiSlice(...a),
			...createFeedbackSlice(...a),
			...createBeaconSlice(...a),
			...createDockSlice(...a),
		}),
		{
			name: TARGET_HUB_STORAGE_KEY,
			partialize: (state) => ({
				mode: state.mode,
				beaconYRatio: state.beaconYRatio,
			}),
		},
	),
);
