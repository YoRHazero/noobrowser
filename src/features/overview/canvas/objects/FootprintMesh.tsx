import { Line } from "@react-three/drei";
import {
	FOOTPRINT_LINE_RADIUS_OFFSET,
	FOOTPRINT_LINE_WIDTH_PX,
} from "@/features/overview/shared/constants";
import type { OverviewFootprintRecord } from "@/features/overview/shared/types";
import { toFootprintLinePoints } from "@/features/overview/utils/footprintGeometry";

export interface FootprintMeshProps {
	footprint: OverviewFootprintRecord;
	radius: number;
	isSelected?: boolean;
	isHovered?: boolean;
}

export function FootprintMesh({
	footprint,
	radius,
	isSelected = false,
	isHovered = false,
}: FootprintMeshProps) {
	const linePoints = toFootprintLinePoints(
		footprint.vertices,
		radius * FOOTPRINT_LINE_RADIUS_OFFSET,
	).map((point) => [point.x, point.y, point.z] as [number, number, number]);
	const color = isSelected ? "#f59e0b" : isHovered ? "#7dd3fc" : "#9fb3c8";

	return (
		<group>
			<Line
				points={linePoints}
				color={color}
				lineWidth={FOOTPRINT_LINE_WIDTH_PX}
				worldUnits={false}
				transparent={true}
				opacity={0.9}
			/>
		</group>
	);
}
