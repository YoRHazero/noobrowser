import type { TargetHubStore } from "../../store";
import { useTargetHubStore } from "../../store";
import type { TargetHubFitJobSlice } from "./fitJobSlice";

const selectFitJobSlice = (state: TargetHubStore): TargetHubFitJobSlice =>
	state;

export function useFitJobStore<T>(
	selector: (slice: TargetHubFitJobSlice) => T,
): T {
	return useTargetHubStore((state) => selector(selectFitJobSlice(state)));
}

export function getFitJobState(): TargetHubFitJobSlice {
	return selectFitJobSlice(useTargetHubStore.getState());
}
