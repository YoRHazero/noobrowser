import { Line } from "@react-three/drei";
import { MAP_CANVAS_GRATICULE_COLOR } from "../shared/constants";
import type { GraticuleLine } from "../shared/types";

export interface GraticuleLinesProps {
	lines: GraticuleLine[];
	color?: string;
	opacity?: number;
}

export function GraticuleLines({
	lines,
	color = MAP_CANVAS_GRATICULE_COLOR,
	opacity = 0.4,
}: GraticuleLinesProps) {
	return (
		<>
			{lines.map((line, index) => (
				<Line
					key={`${index}-${line.kind}-${line.valueDeg}`}
					points={line.points.map((point) => [point.x, point.y, point.z])}
					color={color}
					transparent={true}
					opacity={opacity}
					lineWidth={1}
				/>
			))}
		</>
	);
}
