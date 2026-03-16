import { Text } from "@chakra-ui/react";
import { useShallow } from "zustand/react/shallow";
import { useIdSyncCounterpartPosition } from "@/features/inspector/hooks/useIdSyncCounterpartPosition";
import { useInspectorStore } from "@/stores/inspector";

export default function BackwardToolbarStatus() {
	const { roiState } = useInspectorStore(
		useShallow((state) => ({
			roiState: state.roiState,
		})),
	);
	const { selectedFootprintId } = useIdSyncCounterpartPosition();
	return (
		<Text fontSize="xs" color="gray.300" fontFamily="mono">
			ROI: ({roiState.x}, {roiState.y}), {roiState.width} x {roiState.height} |
			Group: {selectedFootprintId ?? "N/A"}
		</Text>
	);
}
