export interface OverviewHoverAnchor {
	x: number;
	y: number;
}

export interface OverviewFootprintSlice {
	selectedFootprintId: string | null;
	hoveredFootprintId: string | null;
	hoveredFootprintAnchor: OverviewHoverAnchor | null;
}

export interface OverviewManualTarget {
	id: string;
	ra: number;
	dec: number;
}

export interface OverviewTargetsSlice {
	manualTargets: OverviewManualTarget[];
}

export interface OverviewViewerSlice {
	showGrid: boolean;
	showAtmosphere: boolean;
	pendingFlyToTargetId: string | null;
}

export type OverviewStoreState = OverviewFootprintSlice &
	OverviewTargetsSlice &
	OverviewViewerSlice;
