import type { TargetHubStore } from "../../../../store";
import { useTargetHubStore } from "../../../../store";
import type { TargetHubNedSlice } from "./nedSlice";

const selectNedSlice = (state: TargetHubStore): TargetHubNedSlice => state;

export function useNedStore<T>(selector: (slice: TargetHubNedSlice) => T): T {
	return useTargetHubStore((state) => selector(selectNedSlice(state)));
}

export function getNedState(): TargetHubNedSlice {
	return selectNedSlice(useTargetHubStore.getState());
}
