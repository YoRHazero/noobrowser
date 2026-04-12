import type { WorldCoordinate } from "@/features/overview/shared/types";
import { ManualTargetMarker } from "../objects/ManualTargetMarker";

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
