import { Line } from "@react-three/drei";
import {
	FOOTPRINT_CENTER_RADIUS_OFFSET,
	FOOTPRINT_LINE_RADIUS_OFFSET,
} from "@/features/overview/utils/constant";
import { raDecToCartesian } from "@/features/overview/utils/celestial";
import { toFootprintLinePoints } from "@/features/overview/utils/footprintGeometry";
import type { OverviewFootprintRecord } from "@/features/overview/utils/types";

export interface FootprintMeshProps {
	footprint: OverviewFootprintRecord;
	radius: number;
	isSelected?: boolean;
	isHovered?: boolean;
	onClick?: (footprintId: string) => void;
	onPointerOver?: (footprintId: string) => void;
	onPointerOut?: () => void;
}

export function FootprintMesh({
	footprint,
	radius,
	isSelected = false,
	isHovered = false,
	onClick,
	onPointerOver,
	onPointerOut,
}: FootprintMeshProps) {
	const linePoints = toFootprintLinePoints(
		footprint.vertices,
		radius * FOOTPRINT_LINE_RADIUS_OFFSET,
	).map(
		(point) => [point.x, point.y, point.z] as [number, number, number],
	);
	const center = raDecToCartesian(
		footprint.center,
		radius * FOOTPRINT_CENTER_RADIUS_OFFSET,
	);
	const color = isSelected ? "#f59e0b" : isHovered ? "#7dd3fc" : "#9fb3c8";

	return (
		<group>
			<Line
				points={linePoints}
				color={color}
				lineWidth={1.25}
				transparent={true}
				opacity={0.9}
				onClick={(event) => {
					event.stopPropagation();
					onClick?.(footprint.id);
				}}
				onPointerOver={(event) => {
					event.stopPropagation();
					onPointerOver?.(footprint.id);
				}}
				onPointerOut={(event) => {
					event.stopPropagation();
					onPointerOut?.();
				}}
			/>
			<mesh position={[center.x, center.y, center.z]}>
				<sphereGeometry args={[0.015, 10, 10]} />
				<meshBasicMaterial color={color} />
			</mesh>
		</group>
	);
}
