export interface OverviewHoverAnchor {
	x: number;
	y: number;
}

export type OverviewTooltipMode = "footprint" | "target";
export type OverviewSidebarTab = "footprints" | "targets";

export interface OverviewCursorWorldCoordinate {
	ra: number;
	dec: number;
	anchor: OverviewHoverAnchor;
}

export interface OverviewManualTarget {
	id: string;
	ra: number;
	dec: number;
	label: string;
	createdAt: string;
}
