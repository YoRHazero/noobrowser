import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
	createBeaconSlice,
	type TargetHubBeaconSlice,
} from "../beacon/store/beaconSlice";
import {
	createFitJobSlice,
	type TargetHubFitJobSlice,
} from "../fitJob/store/fitJobSlice";
import { TARGET_HUB_STORAGE_KEY } from "../shared/constants";
import {
	createSheetEditorSlice,
	type TargetHubSheetEditorSlice,
} from "../sheet/store/editorSlice";
import {
	createFeedbackSlice,
	type TargetHubFeedbackSlice,
} from "./feedbackSlice";
import { createShellSlice, type TargetHubShellSlice } from "./shellSlice";

export type TargetHubStore = TargetHubShellSlice &
	TargetHubFeedbackSlice &
	TargetHubBeaconSlice &
	TargetHubSheetEditorSlice &
	TargetHubFitJobSlice;

export const useTargetHubStore = create<TargetHubStore>()(
	persist(
		(...a) => ({
			...createShellSlice(...a),
			...createFeedbackSlice(...a),
			...createBeaconSlice(...a),
			...createSheetEditorSlice(...a),
			...createFitJobSlice(...a),
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
