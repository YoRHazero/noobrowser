import type { TargetHubStore } from "../../store";
import { useTargetHubStore } from "../../store";
import type { TargetHubBeaconSlice } from "./beaconSlice";

const selectBeaconSlice = (state: TargetHubStore): TargetHubBeaconSlice =>
	state;

export function useBeaconStore<T>(
	selector: (slice: TargetHubBeaconSlice) => T,
): T {
	return useTargetHubStore((state) => selector(selectBeaconSlice(state)));
}

export function getBeaconState(): TargetHubBeaconSlice {
	return selectBeaconSlice(useTargetHubStore.getState());
}
