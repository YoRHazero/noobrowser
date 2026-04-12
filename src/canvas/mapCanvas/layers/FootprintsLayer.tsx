import type { MapCanvasFootprintModel } from "../api";
import { FootprintMesh } from "../objects/FootprintMesh";

export interface FootprintsLayerProps {
	footprints: MapCanvasFootprintModel[];
	selectedFootprintId: string | null;
	hoveredFootprintId: string | null;
	radius: number;
}

export function FootprintsLayer({
	footprints,
	selectedFootprintId,
	hoveredFootprintId,
	radius,
}: FootprintsLayerProps) {
	return (
		<>
			{footprints.map((footprint) => (
				<FootprintMesh
					key={footprint.id}
					footprint={footprint}
					radius={radius}
					isSelected={footprint.id === selectedFootprintId}
					isHovered={footprint.id === hoveredFootprintId}
				/>
			))}
		</>
	);
}
