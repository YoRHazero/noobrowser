import { ManualTargetMarker } from "../objects/ManualTargetMarker";
import type { OverviewManualTarget } from "@/stores/overview";

export interface ManualTargetsLayerProps {
	manualTargets: OverviewManualTarget[];
	selectedTargetIds: string[];
	radius: number;
}

export function ManualTargetsLayer({
	manualTargets,
	selectedTargetIds,
	radius,
}: ManualTargetsLayerProps) {
	return (
		<>
			{manualTargets.map((target) => (
				<ManualTargetMarker
					key={target.id}
					coordinate={target}
					radius={radius}
					variant={
						selectedTargetIds.includes(target.id) ? "selected" : "committed"
					}
				/>
			))}
		</>
	);
}
