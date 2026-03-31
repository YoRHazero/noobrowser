import { useMemo } from "react";
import { useSelectedOverviewFootprint } from "./useSelectedOverviewFootprint";

export function useSelectedOverviewFrameIndex(
	currentBasename: string | undefined,
) {
	const { basenameList } = useSelectedOverviewFootprint();

	return useMemo(() => {
		if (!currentBasename) return -1;
		return basenameList.indexOf(currentBasename);
	}, [basenameList, currentBasename]);
}
