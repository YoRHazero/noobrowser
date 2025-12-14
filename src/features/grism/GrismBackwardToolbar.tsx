import { Text } from "@chakra-ui/react";
import { useShallow } from "zustand/react/shallow";
import { useGrismStore } from "@/stores/image";
import { CollapsiblePanel } from "@/components/layout/CollapsiblePanel";
import GrismBackwardNormControls from "@/features/grism/GrismBackwardNormControl";

function MiniStatus() {
    const { roiState }= useGrismStore(
        useShallow((state) => ({
            roiState: state.roiState,
        })),
    );
    return (
        <Text fontSize="xs" color="gray.300" fontFamily="mono">
            ROI: ({roiState.x}, {roiState.y}), {roiState.width} x {roiState.height}
        </Text>
    )
}

export default function GrismBackwardToolbar() {
    return (
        <CollapsiblePanel miniStatus={<MiniStatus />}>
            <GrismBackwardNormControls />
        </CollapsiblePanel>
    )
}