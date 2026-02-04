import { Text } from "@chakra-ui/react";
import { useShallow } from "zustand/react/shallow";
import { useIdSyncCounterpartPosition } from "@/features/grism/hooks/useIdSyncCounterpartPosition";
import { useGrismStore } from "@/stores/image";

export default function BackwardToolbarStatus() {
	const { roiState } = useGrismStore(
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
