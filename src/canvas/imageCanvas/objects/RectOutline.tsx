import { Line } from "@react-three/drei";
import type { Rect } from "../api";

export function RectOutline({
	rect,
	color,
	lineWidth,
	z,
}: {
	rect: Rect;
	color: string;
	lineWidth: number;
	z: number;
}) {
	const points: [number, number, number][] = [
		[rect.x, rect.y, z],
		[rect.x + rect.width, rect.y, z],
		[rect.x + rect.width, rect.y + rect.height, z],
		[rect.x, rect.y + rect.height, z],
		[rect.x, rect.y, z],
	];

	return (
		<Line
			points={points}
			color={color}
			lineWidth={lineWidth}
			transparent
			opacity={1}
			depthTest={false}
			renderOrder={z}
			toneMapped={false}
		/>
	);
}
