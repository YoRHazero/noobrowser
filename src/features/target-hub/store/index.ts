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
	createNedSlice,
	type TargetHubNedSlice,
} from "../sheet/ned/store/nedSlice";
import {
	createSheetEditorSlice,
	type TargetHubSheetEditorSlice,
} from "../sheet/store/editorSlice";
import { createAnchorSlice, type TargetHubAnchorSlice } from "./anchorSlice";
import {
	createFeedbackSlice,
	type TargetHubFeedbackSlice,
} from "./feedbackSlice";
import { createShellSlice, type TargetHubShellSlice } from "./shellSlice";

export type TargetHubStore = TargetHubShellSlice &
	TargetHubAnchorSlice &
	TargetHubFeedbackSlice &
	TargetHubBeaconSlice &
	TargetHubNedSlice &
	TargetHubSheetEditorSlice &
	TargetHubFitJobSlice;

export const useTargetHubStore = create<TargetHubStore>()(
	persist(
		(...a) => ({
			...createShellSlice(...a),
			...createAnchorSlice(...a),
			...createFeedbackSlice(...a),
			...createBeaconSlice(...a),
			...createNedSlice(...a),
			...createSheetEditorSlice(...a),
			...createFitJobSlice(...a),
		}),
		{
			name: TARGET_HUB_STORAGE_KEY,
			version: 1,
			migrate: (persistedState) => {
				if (!persistedState || typeof persistedState !== "object") {
					return persistedState as TargetHubStore;
				}

				const state = persistedState as {
					anchorYRatio?: number;
					beaconYRatio?: number;
				};

				if (
					typeof state.anchorYRatio !== "number" &&
					typeof state.beaconYRatio === "number"
				) {
					return {
						...state,
						anchorYRatio: state.beaconYRatio,
					} as TargetHubStore;
				}

				return state as TargetHubStore;
			},
			partialize: (state) => ({
				mode: state.mode,
				anchorYRatio: state.anchorYRatio,
				nedRadiusArcsec: state.nedRadiusArcsec,
			}),
		},
	),
);
