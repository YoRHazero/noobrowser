import { Line } from "@react-three/drei";
import { useMemo } from "react";
import { SPECTRUM_2D_CANVAS_LINE_WIDTH } from "../shared/constants";

export interface HorizontalGuideLineProps {
	leftX: number;
	rightX: number;
	worldY: number;
	color: string;
}

export function HorizontalGuideLine({
	leftX,
	rightX,
	worldY,
	color,
}: HorizontalGuideLineProps) {
	const points = useMemo(
		() =>
			[
				[leftX, worldY, 1],
				[rightX, worldY, 1],
			] as [number, number, number][],
		[leftX, rightX, worldY],
	);

	return (
		<Line
			color={color}
			points={points}
			lineWidth={SPECTRUM_2D_CANVAS_LINE_WIDTH}
			dashed
			dashSize={6}
			gapSize={4}
		/>
	);
}
