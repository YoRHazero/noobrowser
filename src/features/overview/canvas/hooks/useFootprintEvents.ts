import type { OverviewHoverAnchor } from "@/stores/overview";

export interface UseFootprintEventsParams {
	setSelectedFootprintId: (id: string | null) => void;
	setHoveredFootprint: (
		id: string | null,
		anchor?: OverviewHoverAnchor | null,
	) => void;
	clearHoveredFootprint: () => void;
}

export interface FootprintEventHandlers {
	onFootprintClick: (footprintId: string) => void;
	onFootprintPointerOver: (
		footprintId: string,
		anchor?: OverviewHoverAnchor | null,
	) => void;
	onFootprintPointerOut: () => void;
}

export function useFootprintEvents({
	setSelectedFootprintId,
	setHoveredFootprint,
	clearHoveredFootprint,
}: UseFootprintEventsParams): FootprintEventHandlers {
	return {
		onFootprintClick: (footprintId) => {
			setSelectedFootprintId(footprintId);
		},
		onFootprintPointerOver: (footprintId, anchor = null) => {
			setHoveredFootprint(footprintId, anchor);
		},
		onFootprintPointerOut: () => {
			clearHoveredFootprint();
		},
	};
}
