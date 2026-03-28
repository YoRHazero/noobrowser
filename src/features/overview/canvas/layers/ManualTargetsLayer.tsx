import { ManualTargetMarker } from "../objects/ManualTargetMarker";
import type { OverviewManualTarget } from "@/stores/overview";

export interface ManualTargetsLayerProps {
	manualTargets: OverviewManualTarget[];
	radius: number;
}

export function ManualTargetsLayer({
	manualTargets,
	radius,
}: ManualTargetsLayerProps) {
	return (
		<>
			{manualTargets.map((target) => (
				<ManualTargetMarker
					key={target.id}
					target={target}
					radius={radius}
				/>
			))}
		</>
	);
}
