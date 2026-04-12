import { Line } from "@react-three/drei";
import type { GraticuleLine } from "@/features/overview/shared/types";

export interface GraticuleLinesProps {
	lines: GraticuleLine[];
	color?: string;
	opacity?: number;
}

export function GraticuleLines({
	lines,
	color = "#4f667a",
	opacity = 0.4,
}: GraticuleLinesProps) {
	return (
		<>
			{lines.map((line, index) => (
				<Line
					key={`${index}-${line.points.length}`}
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
