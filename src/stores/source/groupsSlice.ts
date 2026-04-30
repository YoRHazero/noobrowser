import type { StateCreator } from "zustand";
import type { SourceStore } from ".";
import type { SourceGroup, SourceVisibilityKey } from "./types";
import { normalizeSourceTag, normalizeSourceTags } from "./utils";

const DEFAULT_GROUP_VISIBILITY = {
	overviewVisibility: true,
	inspectorVisibility: true,
};

function createDefaultSourceGroup(tag: string): SourceGroup {
	return {
		tag,
		...DEFAULT_GROUP_VISIBILITY,
	};
}

function getGroupVisibilityPatch(
	group: SourceGroup,
): Record<SourceVisibilityKey, boolean> {
	return {
		overview: group.overviewVisibility,
		inspector: group.inspectorVisibility,
	};
}

function ensureSourceGroups(
	sourceGroups: SourceGroup[],
	tags: readonly string[],
): SourceGroup[] {
	const existingTags = new Set(sourceGroups.map((group) => group.tag));
	const nextGroups = [...sourceGroups];

	for (const tag of tags) {
		if (existingTags.has(tag)) {
			continue;
		}

		existingTags.add(tag);
		nextGroups.push(createDefaultSourceGroup(tag));
	}

	return nextGroups;
}

export interface SourceGroupsSlice {
	sourceGroups: SourceGroup[];
	selectedGroup: string | null;
	createSourceGroup: (tag: string) => SourceGroup | null;
	deleteSourceGroup: (tag: string) => void;
	renameSourceGroup: (oldTag: string, nextTag: string) => void;
	setSelectedGroup: (tag: string | null) => void;
	setGroupVisibility: (
		tag: string,
		key: SourceVisibilityKey,
		visible: boolean,
	) => void;
	addSourceTag: (sourceId: string, tag: string) => void;
	removeSourceTag: (sourceId: string, tag: string) => void;
	setSourceTags: (sourceId: string, tags: readonly string[]) => void;
}

export const createSourceGroupsSlice: StateCreator<
	SourceStore,
	[],
	[],
	SourceGroupsSlice
> = (set, get) => ({
	sourceGroups: [],
	selectedGroup: null,
	createSourceGroup: (tag) => {
		const normalizedTag = normalizeSourceTag(tag);
		if (normalizedTag === null) {
			return null;
		}

		const existingGroup = get().sourceGroups.find(
			(group) => group.tag === normalizedTag,
		);
		if (existingGroup) {
			return existingGroup;
		}

		const nextGroup = createDefaultSourceGroup(normalizedTag);
		set((state) => ({
			sourceGroups: [...state.sourceGroups, nextGroup],
		}));

		return nextGroup;
	},
	deleteSourceGroup: (tag) => {
		const normalizedTag = normalizeSourceTag(tag);
		if (normalizedTag === null) {
			return;
		}

		set((state) => ({
			sourceGroups: state.sourceGroups.filter(
				(group) => group.tag !== normalizedTag,
			),
			selectedGroup:
				state.selectedGroup === normalizedTag ? null : state.selectedGroup,
			sources: state.sources.map((source) => ({
				...source,
				tags: source.tags.filter((sourceTag) => sourceTag !== normalizedTag),
			})),
		}));
	},
	renameSourceGroup: (oldTag, nextTag) => {
		const normalizedOldTag = normalizeSourceTag(oldTag);
		const normalizedNextTag = normalizeSourceTag(nextTag);
		if (
			normalizedOldTag === null ||
			normalizedNextTag === null ||
			normalizedOldTag === normalizedNextTag
		) {
			return;
		}

		set((state) => {
			const oldGroup = state.sourceGroups.find(
				(group) => group.tag === normalizedOldTag,
			);
			if (!oldGroup) {
				return state;
			}

			const nextGroupExists = state.sourceGroups.some(
				(group) => group.tag === normalizedNextTag,
			);

			return {
				sourceGroups: nextGroupExists
					? state.sourceGroups.filter((group) => group.tag !== normalizedOldTag)
					: state.sourceGroups.map((group) =>
							group.tag === normalizedOldTag
								? {
										...group,
										tag: normalizedNextTag,
									}
								: group,
						),
				selectedGroup:
					state.selectedGroup === normalizedOldTag
						? normalizedNextTag
						: state.selectedGroup,
				sources: state.sources.map((source) => ({
					...source,
					tags: normalizeSourceTags(
						source.tags.map((sourceTag) =>
							sourceTag === normalizedOldTag ? normalizedNextTag : sourceTag,
						),
					),
				})),
			};
		});
	},
	setSelectedGroup: (tag) => {
		if (tag === null) {
			set({ selectedGroup: null });
			return;
		}

		const normalizedTag = normalizeSourceTag(tag);
		if (normalizedTag === null) {
			return;
		}

		set((state) => {
			const group = state.sourceGroups.find(
				(group) => group.tag === normalizedTag,
			);
			if (!group) {
				return state;
			}

			const visibilityPatch = getGroupVisibilityPatch(group);

			return {
				selectedGroup: normalizedTag,
				sources: state.sources.map((source) =>
					source.tags.includes(normalizedTag)
						? {
								...source,
								visibility: {
									...source.visibility,
									...visibilityPatch,
								},
							}
						: source,
				),
			};
		});
	},
	setGroupVisibility: (tag, key, visible) => {
		const normalizedTag = normalizeSourceTag(tag);
		if (normalizedTag === null) {
			return;
		}

		const visibilityGroupKey =
			key === "overview" ? "overviewVisibility" : "inspectorVisibility";

		set((state) => {
			if (!state.sourceGroups.some((group) => group.tag === normalizedTag)) {
				return state;
			}

			return {
				sourceGroups: state.sourceGroups.map((group) =>
					group.tag === normalizedTag
						? {
								...group,
								[visibilityGroupKey]: visible,
							}
						: group,
				),
				sources: state.sources.map((source) =>
					source.tags.includes(normalizedTag)
						? {
								...source,
								visibility: {
									...source.visibility,
									[key]: visible,
								},
							}
						: source,
				),
			};
		});
	},
	addSourceTag: (sourceId, tag) => {
		const normalizedTag = normalizeSourceTag(tag);
		if (normalizedTag === null) {
			return;
		}

		set((state) => {
			const sourceIndex = state.sources.findIndex(
				(source) => source.id === sourceId,
			);
			if (sourceIndex === -1) {
				return state;
			}

			const sourceGroups = ensureSourceGroups(state.sourceGroups, [
				normalizedTag,
			]);
			const group = sourceGroups.find((group) => group.tag === normalizedTag);
			const visibilityPatch = group ? getGroupVisibilityPatch(group) : {};

			return {
				sourceGroups,
				sources: state.sources.map((source) =>
					source.id === sourceId
						? {
								...source,
								tags: normalizeSourceTags([...source.tags, normalizedTag]),
								visibility: {
									...source.visibility,
									...visibilityPatch,
								},
							}
						: source,
				),
			};
		});
	},
	removeSourceTag: (sourceId, tag) => {
		const normalizedTag = normalizeSourceTag(tag);
		if (normalizedTag === null) {
			return;
		}

		set((state) => ({
			sources: state.sources.map((source) =>
				source.id === sourceId
					? {
							...source,
							tags: source.tags.filter(
								(sourceTag) => sourceTag !== normalizedTag,
							),
						}
					: source,
			),
		}));
	},
	setSourceTags: (sourceId, tags) => {
		const normalizedTags = normalizeSourceTags(tags);

		set((state) => {
			const source = state.sources.find((source) => source.id === sourceId);
			if (!source) {
				return state;
			}

			const sourceGroups = ensureSourceGroups(
				state.sourceGroups,
				normalizedTags,
			);
			const sourceGroupByTag = new Map(
				sourceGroups.map((group) => [group.tag, group]),
			);
			const addedTags = normalizedTags.filter(
				(tag) => !source.tags.includes(tag),
			);
			const visibilityPatch: Partial<Record<SourceVisibilityKey, boolean>> = {};
			for (const tag of addedTags) {
				const group = sourceGroupByTag.get(tag);
				if (!group) {
					continue;
				}

				visibilityPatch.overview = group.overviewVisibility;
				visibilityPatch.inspector = group.inspectorVisibility;
			}

			return {
				sourceGroups,
				sources: state.sources.map((item) =>
					item.id === sourceId
						? {
								...item,
								tags: normalizedTags,
								visibility: {
									...item.visibility,
									...visibilityPatch,
								},
							}
						: item,
				),
			};
		});
	},
});
