import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
	createSourceEntitiesSlice,
	type SourceEntitiesSlice,
} from "./entitiesSlice";
import { createSourceGroupsSlice, type SourceGroupsSlice } from "./groupsSlice";
import {
	createSourceSelectionSlice,
	type SourceSelectionSlice,
} from "./selectionSlice";
import type { Source, SourceGroup } from "./types";
import { normalizeSourceTag, normalizeSourceTags } from "./utils";

export type SourceStore = SourceEntitiesSlice &
	SourceGroupsSlice &
	SourceSelectionSlice;

const SOURCE_STORE_STORAGE_KEY = "noobrowser-source-store";
const SOURCE_STORE_VERSION = 2;

type PersistedSourceStoreState = Pick<
	SourceStore,
	"sources" | "sourceGroups" | "selectedGroup" | "activeSourceId"
>;

function normalizePersistedSource(source: Source): Source {
	const extractionParams = source.spectrum.extractionParams;

	return {
		...source,
		tags: normalizeSourceTags(source.tags ?? []),
		spectrum: {
			extractionParams,
			status: extractionParams === null ? "idle" : "committed",
		},
	};
}

function normalizePersistedSourceGroup(
	group: Partial<SourceGroup>,
): SourceGroup | null {
	const tag =
		typeof group.tag === "string" ? normalizeSourceTag(group.tag) : null;
	if (tag === null) {
		return null;
	}

	return {
		tag,
		overviewVisibility:
			typeof group.overviewVisibility === "boolean"
				? group.overviewVisibility
				: true,
		inspectorVisibility:
			typeof group.inspectorVisibility === "boolean"
				? group.inspectorVisibility
				: true,
	};
}

function normalizePersistedState(
	state: Partial<PersistedSourceStoreState>,
): PersistedSourceStoreState {
	const sources = Array.isArray(state.sources)
		? state.sources.map(normalizePersistedSource)
		: [];
	const sourceGroups: SourceGroup[] = [];
	const sourceGroupTags = new Set<string>();

	if (Array.isArray(state.sourceGroups)) {
		for (const group of state.sourceGroups) {
			const normalizedGroup = normalizePersistedSourceGroup(group);
			if (!normalizedGroup || sourceGroupTags.has(normalizedGroup.tag)) {
				continue;
			}

			sourceGroups.push(normalizedGroup);
			sourceGroupTags.add(normalizedGroup.tag);
		}
	}

	for (const source of sources) {
		for (const tag of source.tags) {
			if (sourceGroupTags.has(tag)) {
				continue;
			}

			sourceGroups.push({
				tag,
				overviewVisibility: true,
				inspectorVisibility: true,
			});
			sourceGroupTags.add(tag);
		}
	}

	const sourceIds = new Set(sources.map((source) => source.id));
	const activeSourceId =
		typeof state.activeSourceId === "string" &&
		sourceIds.has(state.activeSourceId)
			? state.activeSourceId
			: null;
	const normalizedSelectedGroup =
		typeof state.selectedGroup === "string"
			? normalizeSourceTag(state.selectedGroup)
			: null;
	const selectedGroup =
		normalizedSelectedGroup !== null &&
		sourceGroupTags.has(normalizedSelectedGroup)
			? normalizedSelectedGroup
			: null;

	return {
		sources,
		sourceGroups,
		selectedGroup,
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
	SourceGroup,
	SourceImageRef,
	SourcePosition,
	SourceSpectrumExtractionParams,
	SourceSpectrumState,
	SourceSpectrumStatus,
	SourceVisibility,
	SourceVisibilityKey,
} from "./types";
export {
	generateColor,
	normalizeSourceTag,
	normalizeSourceTags,
} from "./utils";

export const useSourceStore = create<SourceStore>()(
	persist(
		(...a) => ({
			...createSourceEntitiesSlice(...a),
			...createSourceGroupsSlice(...a),
			...createSourceSelectionSlice(...a),
		}),
		{
			name: SOURCE_STORE_STORAGE_KEY,
			version: SOURCE_STORE_VERSION,
			partialize: (state) =>
				normalizePersistedState({
					sources: state.sources,
					sourceGroups: state.sourceGroups,
					selectedGroup: state.selectedGroup,
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
