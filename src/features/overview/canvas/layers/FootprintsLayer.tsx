import { FootprintMesh } from "../objects/FootprintMesh";
import type { OverviewFootprintRecord } from "@/features/overview/utils/types";
import type { OverviewHoverAnchor } from "@/stores/overview";

export interface FootprintEventHandlers {
	onFootprintClick: (footprintId: string) => void;
	onFootprintPointerOver: (
		footprintId: string,
		anchor?: OverviewHoverAnchor | null,
	) => void;
	onFootprintPointerOut: () => void;
}

export interface FootprintsLayerProps {
	footprints: OverviewFootprintRecord[];
	selectedFootprintId: string | null;
	hoveredFootprintId: string | null;
	radius: number;
	events: FootprintEventHandlers;
}

export function FootprintsLayer({
	footprints,
	selectedFootprintId,
	hoveredFootprintId,
	radius,
	events,
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
					onClick={events.onFootprintClick}
					onPointerOver={events.onFootprintPointerOver}
					onPointerOut={events.onFootprintPointerOut}
				/>
			))}
		</>
	);
}
