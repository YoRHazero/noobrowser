import { extend } from "@pixi/react";
import { Container, Text } from "pixi.js";
import { useGlobeStore } from "@/stores/footprints";

extend({ Container, Text });

export default function FootprintTooltip() {
	const id = useGlobeStore((s) => s.hoveredFootprintId);
	const pos = useGlobeStore((s) => s.hoveredFootprintMousePosition);

	if (!id || !pos) return null;

	return (
		<pixiContainer eventMode="passive">
			<pixiText
				x={pos.x + 12}
				y={pos.y + 12}
				roundPixels={true}
				text={`ID: ${id}`}
				style={{
					fontSize: 12,
					fill: 0xffffff,
					stroke: { color: 0x000000, width: 3, alignment: 0.5 },
					dropShadow: { color: 0x000000, blur: 2, distance: 2, alpha: 0.4 },
				}}
			/>
		</pixiContainer>
	);
}
