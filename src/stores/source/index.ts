import { create } from "zustand";
import {
	createSourceEntitiesSlice,
	type SourceEntitiesSlice,
} from "./entitiesSlice";
import {
	createSourceSelectionSlice,
	type SourceSelectionSlice,
} from "./selectionSlice";

export type SourceStore = SourceEntitiesSlice & SourceSelectionSlice;

export type {
	Source,
	SourceCreateInput,
	SourceImageRef,
	SourcePosition,
	SourceSpectrumExtractionParams,
	SourceSpectrumState,
	SourceSpectrumStatus,
	SourceVisibility,
	SourceVisibilityKey,
} from "./types";
export { generateColor } from "./utils";

export const useSourceStore = create<SourceStore>()((...a) => ({
	...createSourceEntitiesSlice(...a),
	...createSourceSelectionSlice(...a),
}));
