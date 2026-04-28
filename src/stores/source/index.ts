import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
	createSourceEntitiesSlice,
	type SourceEntitiesSlice,
} from "./entitiesSlice";
import {
	createSourceSelectionSlice,
	type SourceSelectionSlice,
} from "./selectionSlice";
import type { Source } from "./types";

export type SourceStore = SourceEntitiesSlice & SourceSelectionSlice;

const SOURCE_STORE_STORAGE_KEY = "noobrowser-source-store";
const SOURCE_STORE_VERSION = 1;

type PersistedSourceStoreState = Pick<
	SourceStore,
	"sources" | "activeSourceId"
>;

function normalizePersistedSource(source: Source): Source {
	const extractionParams = source.spectrum.extractionParams;

	return {
		...source,
		spectrum: {
			extractionParams,
			status: extractionParams === null ? "idle" : "committed",
		},
	};
}

function normalizePersistedState(
	state: Partial<PersistedSourceStoreState>,
): PersistedSourceStoreState {
	const sources = Array.isArray(state.sources)
		? state.sources.map(normalizePersistedSource)
		: [];
	const sourceIds = new Set(sources.map((source) => source.id));
	const activeSourceId =
		typeof state.activeSourceId === "string" &&
		sourceIds.has(state.activeSourceId)
			? state.activeSourceId
			: null;

	return {
		sources,
		activeSourceId,
	};
}

function migrateSourceStore(
	persistedState: unknown,
): PersistedSourceStoreState {
	if (!persistedState || typeof persistedState !== "object") {
		return normalizePersistedState({});
	}

	return normalizePersistedState(
		persistedState as Partial<PersistedSourceStoreState>,
	);
}

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

export const useSourceStore = create<SourceStore>()(
	persist(
		(...a) => ({
			...createSourceEntitiesSlice(...a),
			...createSourceSelectionSlice(...a),
		}),
		{
			name: SOURCE_STORE_STORAGE_KEY,
			version: SOURCE_STORE_VERSION,
			partialize: (state) =>
				normalizePersistedState({
					sources: state.sources,
					activeSourceId: state.activeSourceId,
				}),
			migrate: migrateSourceStore,
			merge: (persistedState, currentState) => ({
				...currentState,
				...migrateSourceStore(persistedState),
			}),
		},
	),
);
