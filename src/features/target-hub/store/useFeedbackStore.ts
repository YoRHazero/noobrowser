import type { TargetHubFeedbackSlice } from "./feedbackSlice";
import type { TargetHubStore } from "./index";
import { useTargetHubStore } from "./index";

const selectFeedbackSlice = (state: TargetHubStore): TargetHubFeedbackSlice =>
	state;

export function useFeedbackStore<T>(
	selector: (slice: TargetHubFeedbackSlice) => T,
): T {
	return useTargetHubStore((state) => selector(selectFeedbackSlice(state)));
}

export function getFeedbackState(): TargetHubFeedbackSlice {
	return selectFeedbackSlice(useTargetHubStore.getState());
}
