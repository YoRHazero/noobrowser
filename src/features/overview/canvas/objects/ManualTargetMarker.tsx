import { MANUAL_TARGET_RADIUS_OFFSET } from "@/features/overview/utils/constant";
import { raDecToCartesian } from "@/features/overview/utils/celestial";
import type { OverviewManualTarget } from "@/stores/overview";

export interface ManualTargetMarkerProps {
	target: OverviewManualTarget;
	radius: number;
	color?: string;
}

export function ManualTargetMarker({
	target,
	radius,
	color = "#f59e0b",
}: ManualTargetMarkerProps) {
	const position = raDecToCartesian(target, radius * MANUAL_TARGET_RADIUS_OFFSET);

	return (
		<mesh position={[position.x, position.y, position.z]}>
			<sphereGeometry args={[0.02, 12, 12]} />
			<meshStandardMaterial color={color} />
		</mesh>
	);
}
