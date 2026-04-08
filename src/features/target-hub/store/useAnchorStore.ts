import type { TargetHubAnchorSlice } from "./anchorSlice";
import type { TargetHubStore } from "./index";
import { useTargetHubStore } from "./index";

const selectAnchorSlice = (state: TargetHubStore): TargetHubAnchorSlice =>
	state;

export function useAnchorStore<T>(
	selector: (slice: TargetHubAnchorSlice) => T,
): T {
	return useTargetHubStore((state) => selector(selectAnchorSlice(state)));
}

export function getAnchorState(): TargetHubAnchorSlice {
	return selectAnchorSlice(useTargetHubStore.getState());
}
