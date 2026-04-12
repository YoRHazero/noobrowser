import { Line } from "@react-three/drei";
import type { MapCanvasFootprintModel } from "../api";
import {
	MAP_CANVAS_FOOTPRINT_COLOR,
	MAP_CANVAS_FOOTPRINT_HOVER_COLOR,
	MAP_CANVAS_FOOTPRINT_LINE_RADIUS_OFFSET,
	MAP_CANVAS_FOOTPRINT_LINE_WIDTH_PX,
	MAP_CANVAS_FOOTPRINT_SELECTED_COLOR,
} from "../shared/constants";
import { toFootprintLinePoints } from "../utils";

export interface FootprintMeshProps {
	footprint: MapCanvasFootprintModel;
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
		radius * MAP_CANVAS_FOOTPRINT_LINE_RADIUS_OFFSET,
	).map((point) => [point.x, point.y, point.z] as [number, number, number]);
	const color = isSelected
		? MAP_CANVAS_FOOTPRINT_SELECTED_COLOR
		: isHovered
			? MAP_CANVAS_FOOTPRINT_HOVER_COLOR
			: MAP_CANVAS_FOOTPRINT_COLOR;

	return (
		<group>
			<Line
				points={linePoints}
				color={color}
				lineWidth={MAP_CANVAS_FOOTPRINT_LINE_WIDTH_PX}
				worldUnits={false}
				transparent={true}
				opacity={0.9}
			/>
		</group>
	);
}
