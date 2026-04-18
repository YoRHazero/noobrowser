import { Line } from "@react-three/drei";
import { useMemo } from "react";
import { SPECTRUM_2D_CANVAS_LINE_WIDTH } from "../shared/constants";

export interface RectangleOutlineProps {
	leftX: number;
	rightX: number;
	topY: number;
	bottomY: number;
	color: string;
}

export function RectangleOutline({
	leftX,
	rightX,
	topY,
	bottomY,
	color,
}: RectangleOutlineProps) {
	const points = useMemo(
		() =>
			[
				[leftX, topY, 2],
				[rightX, topY, 2],
				[rightX, bottomY, 2],
				[leftX, bottomY, 2],
				[leftX, topY, 2],
			] as [number, number, number][],
		[bottomY, leftX, rightX, topY],
	);

	return (
		<Line
			color={color}
			points={points}
			lineWidth={SPECTRUM_2D_CANVAS_LINE_WIDTH}
		/>
	);
}
