import { ManualTargetMarker } from "../objects/ManualTargetMarker";
import type { WorldCoordinate } from "@/features/overview/utils/types";

export interface DraftTargetLayerProps {
	draftTarget: WorldCoordinate | null;
	radius: number;
}

export function DraftTargetLayer({
	draftTarget,
	radius,
}: DraftTargetLayerProps) {
	if (!draftTarget) {
		return null;
	}

	return (
		<ManualTargetMarker
			coordinate={draftTarget}
			radius={radius}
			variant="draft"
		/>
	);
}
