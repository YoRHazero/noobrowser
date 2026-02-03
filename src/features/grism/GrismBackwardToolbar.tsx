import { Text } from "@chakra-ui/react";
import { useShallow } from "zustand/react/shallow";
import { CollapsiblePanel } from "@/components/layout/CollapsiblePanel";
import GrismBackwardCounterpartControl from "@/features/grism/backwardtoolbar/GrismBackwardCounterpartControl";
import GrismBackwardNormControls from "@/features/grism/backwardtoolbar/GrismBackwardNormControl";
import EmissionMaskControl from "@/features/grism/backwardtoolbar/EmissionMaskControl";
import { useIdSyncCounterpartPosition } from "@/features/grism/hooks/useIdSyncCounterpartPosition";
import { useGrismStore } from "@/stores/image";

function MiniStatus() {
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

export default function GrismBackwardToolbar() {
	return (
		<CollapsiblePanel miniStatus={<MiniStatus />}>
			<GrismBackwardCounterpartControl />
			<GrismBackwardNormControls />
			<EmissionMaskControl />
		</CollapsiblePanel>
	);
}
