import type { OverviewViewerSlice } from "./types";

export const createOverviewViewerSlice = (): OverviewViewerSlice => ({
	showGrid: true,
	showAtmosphere: true,
	pendingFlyToTargetId: null,
});
