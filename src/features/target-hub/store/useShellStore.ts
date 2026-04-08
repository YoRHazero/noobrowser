import type { TargetHubStore } from "./index";
import { useTargetHubStore } from "./index";
import type { TargetHubShellSlice } from "./shellSlice";

const selectShellSlice = (state: TargetHubStore): TargetHubShellSlice => state;

export function useShellStore<T>(
	selector: (slice: TargetHubShellSlice) => T,
): T {
	return useTargetHubStore((state) => selector(selectShellSlice(state)));
}

export function getShellState(): TargetHubShellSlice {
	return selectShellSlice(useTargetHubStore.getState());
}
