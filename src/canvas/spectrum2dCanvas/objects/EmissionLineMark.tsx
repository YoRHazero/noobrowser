import { Line, Text } from "@react-three/drei";
import { useMemo } from "react";
import {
	SPECTRUM_2D_CANVAS_EMISSION_LABEL_OFFSET,
	SPECTRUM_2D_CANVAS_EMISSION_LABEL_SIZE,
	SPECTRUM_2D_CANVAS_LINE_WIDTH,
} from "../shared/constants";

export interface EmissionLineMarkProps {
	worldX: number;
	topY: number;
	bottomY: number;
	color: string;
	label: string;
}

export function EmissionLineMark({
	worldX,
	topY,
	bottomY,
	color,
	label,
}: EmissionLineMarkProps) {
	const points = useMemo(
		() =>
			[
				[worldX, topY, 2],
				[worldX, bottomY, 2],
			] as [number, number, number][],
		[bottomY, topY, worldX],
	);

	return (
		<group>
			<Line
				color={color}
				points={points}
				lineWidth={SPECTRUM_2D_CANVAS_LINE_WIDTH}
			/>
			<Text
				position={[worldX, topY + SPECTRUM_2D_CANVAS_EMISSION_LABEL_OFFSET, 3]}
				color={color}
				fontSize={SPECTRUM_2D_CANVAS_EMISSION_LABEL_SIZE}
				anchorX="center"
				anchorY="top"
			>
				{label}
			</Text>
		</group>
	);
}
