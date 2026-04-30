"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import {
	normalizeSourceTag,
	type SourceGroup,
	type SourceVisibilityKey,
	useSourceStore,
} from "@/stores/source";

export const ALL_GROUPS_VALUE = "__all-groups__";

export interface GroupOption {
	label: string;
	value: string;
	memberCount: number;
}

export interface GroupsModel {
	groups: SourceGroup[];
	groupOptions: GroupOption[];
	selectedValue: string;
	selectedGroup: SourceGroup | null;
	selectedGroupMemberCount: number;
	canDeleteGroup: boolean;
	canCreateGroupTag: (tag: string) => boolean;
	canRenameGroupTag: (tag: string) => boolean;
	onSelectGroupValue: (value: string) => void;
	onToggleGroupVisibility: (key: SourceVisibilityKey) => void;
	onCreateGroup: (tag: string) => boolean;
	onRenameGroup: (tag: string) => boolean;
	onDeleteGroup: () => void;
}

function getGroupMemberCount(tag: string, sources: { tags: string[] }[]) {
	let count = 0;
	for (const source of sources) {
		if (source.tags.includes(tag)) {
			count += 1;
		}
	}

	return count;
}

export function useGroups(): GroupsModel {
	const {
		sourceGroups,
		selectedGroup,
		sources,
		createSourceGroup,
		deleteSourceGroup,
		renameSourceGroup,
		setSelectedGroup,
		setGroupVisibility,
	} = useSourceStore(
		useShallow((state) => ({
			sourceGroups: state.sourceGroups,
			selectedGroup: state.selectedGroup,
			sources: state.sources,
			createSourceGroup: state.createSourceGroup,
			deleteSourceGroup: state.deleteSourceGroup,
			renameSourceGroup: state.renameSourceGroup,
			setSelectedGroup: state.setSelectedGroup,
			setGroupVisibility: state.setGroupVisibility,
		})),
	);
	const selectedSourceGroup =
		sourceGroups.find((group) => group.tag === selectedGroup) ?? null;
	const groupOptions = useMemo<GroupOption[]>(
		() => [
			{
				label: "All sources",
				value: ALL_GROUPS_VALUE,
				memberCount: sources.length,
			},
			...sourceGroups.map((group) => ({
				label: group.tag,
				value: group.tag,
				memberCount: getGroupMemberCount(group.tag, sources),
			})),
		],
		[sourceGroups, sources],
	);
	const selectedGroupMemberCount = selectedSourceGroup
		? getGroupMemberCount(selectedSourceGroup.tag, sources)
		: sources.length;

	const canCreateGroupTag = (tag: string) => {
		const normalizedTag = normalizeSourceTag(tag);
		return (
			normalizedTag !== null &&
			!sourceGroups.some((group) => group.tag === normalizedTag)
		);
	};

	const canRenameGroupTag = (tag: string) => {
		const normalizedTag = normalizeSourceTag(tag);
		return (
			selectedSourceGroup !== null &&
			normalizedTag !== null &&
			normalizedTag !== selectedSourceGroup.tag
		);
	};

	const handleCreateGroup = (tag: string) => {
		const group = createSourceGroup(tag);
		if (!group) {
			return false;
		}

		setSelectedGroup(group.tag);
		return true;
	};

	const handleRenameGroup = (tag: string) => {
		const normalizedTag = normalizeSourceTag(tag);
		if (!selectedSourceGroup || normalizedTag === null) {
			return false;
		}

		renameSourceGroup(selectedSourceGroup.tag, normalizedTag);
		return true;
	};

	return {
		groups: sourceGroups,
		groupOptions,
		selectedValue: selectedGroup ?? ALL_GROUPS_VALUE,
		selectedGroup: selectedSourceGroup,
		selectedGroupMemberCount,
		canDeleteGroup: selectedSourceGroup !== null,
		canCreateGroupTag,
		canRenameGroupTag,
		onSelectGroupValue: (value) => {
			setSelectedGroup(value === ALL_GROUPS_VALUE ? null : value);
		},
		onToggleGroupVisibility: (key) => {
			if (!selectedSourceGroup) {
				return;
			}

			const visible =
				key === "overview"
					? selectedSourceGroup.overviewVisibility
					: selectedSourceGroup.inspectorVisibility;
			setGroupVisibility(selectedSourceGroup.tag, key, !visible);
		},
		onCreateGroup: handleCreateGroup,
		onRenameGroup: handleRenameGroup,
		onDeleteGroup: () => {
			if (!selectedSourceGroup) {
				return;
			}

			deleteSourceGroup(selectedSourceGroup.tag);
		},
	};
}
