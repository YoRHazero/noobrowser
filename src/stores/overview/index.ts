import { create } from "zustand";
import { createOverviewFootprintSlice } from "./footprintSlice";
import { createOverviewTargetsSlice } from "./targetsSlice";
import { createOverviewViewerSlice } from "./viewerSlice";
import type { OverviewStoreState } from "./types";

export type {
	OverviewFootprintSlice,
	OverviewHoverAnchor,
	OverviewManualTarget,
	OverviewStoreState,
	OverviewTargetsSlice,
	OverviewViewerSlice,
} from "./types";

export const useOverviewStore = create<OverviewStoreState>()(() => ({
	...createOverviewFootprintSlice(),
	...createOverviewTargetsSlice(),
	...createOverviewViewerSlice(),
}));
