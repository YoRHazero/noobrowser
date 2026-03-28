import type { OverviewHoverAnchor } from "@/stores/overview";

export interface UseFootprintEventsParams {
	selectedFootprintId: string | null;
	hoveredFootprintId: string | null;
	setSelectedFootprintId: (id: string | null) => void;
	setHoveredFootprint: (
		id: string | null,
		anchor?: OverviewHoverAnchor | null,
	) => void;
	clearHoveredFootprint: () => void;
}

export interface UseFootprintEventsResult {
	onFootprintClick: () => void;
	onFootprintHover: (
		footprintId: string,
		anchor?: OverviewHoverAnchor | null,
	) => void;
	onFootprintHoverClear: () => void;
}

export function useFootprintEvents({
	selectedFootprintId,
	hoveredFootprintId,
	setSelectedFootprintId,
	setHoveredFootprint,
	clearHoveredFootprint,
}: UseFootprintEventsParams): UseFootprintEventsResult {
	return {
		onFootprintClick: () => {
			if (!hoveredFootprintId) {
				return;
			}

			setSelectedFootprintId(
				hoveredFootprintId === selectedFootprintId ? null : hoveredFootprintId,
			);
		},
		onFootprintHover: (footprintId, anchor = null) => {
			setHoveredFootprint(footprintId, anchor);
		},
		onFootprintHoverClear: () => {
			clearHoveredFootprint();
		},
	};
}
