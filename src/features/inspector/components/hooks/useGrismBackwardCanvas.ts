import { useGrismData, useGrismOffsets } from "@/hooks/query/image";
import { useInspectorStore } from "@/stores/inspector";
import { useShallow } from "zustand/react/shallow";
import { useSelectedOverviewFootprint } from "@/features/inspector/hooks/useSelectedOverviewFootprint";

export function useGrismBackwardCanvas({
	currentBasename,
}: { currentBasename: string | undefined }) {
	const { roiState, backwardGlobalNorm } = useInspectorStore(
		useShallow((state) => ({
			roiState: state.roiState,
			backwardGlobalNorm: state.backwardGlobalNorm,
		})),
	);
	const { selectedFootprintId } = useSelectedOverviewFootprint();
	const basenameList = currentBasename ? [currentBasename] : [];

	/* -------------------------------------------------------------------------- */
	/*                                 Data Access                                */
	/* -------------------------------------------------------------------------- */
	// refetch will be triggered by other components, here just read from cache
	const grismDataResults = useGrismData({ basenameList });
	const grismOffsetsResults = useGrismOffsets({
		groupId: selectedFootprintId,
		basenameList,
	});

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
