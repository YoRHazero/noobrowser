import { useGrismData, useGrismOffsets } from "@/hooks/query/grism";
import { useGrismStore } from "@/stores/image";
import { useShallow } from "zustand/react/shallow";

export function useGrismBackwardCanvas({
	currentBasename,
}: { currentBasename: string | undefined }) {
	const { roiState, backwardGlobalNorm } = useGrismStore(
		useShallow((state) => ({
			roiState: state.roiState,
			backwardGlobalNorm: state.backwardGlobalNorm,
		})),
	);

	/* -------------------------------------------------------------------------- */
	/*                                 Data Access                                */
	/* -------------------------------------------------------------------------- */
	// refetch will be triggered by other components, here just read from cache
	const grismDataResults = useGrismData({});
	const grismOffsetsResults = useGrismOffsets({});

	const currentGrismData = currentBasename
		? grismDataResults?.[currentBasename]?.data
		: undefined;
	const currentGrismOffsets = currentBasename
		? grismOffsetsResults?.[currentBasename]?.data
		: undefined;

	return {
		roiState,
		backwardGlobalNorm,
		currentGrismData,
		currentGrismOffsets,
	};
}

